import { useState, useRef, useCallback } from 'react';

interface UseAudioTranscriptionReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  transcript: string;
  error: string | null;
  isPermissionDenied: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  transcribeAudioFile: (file: File) => Promise<string | null>;
  clearTranscript: () => void;
  resetError: () => void;
}

export function useAudioTranscription(): UseAudioTranscriptionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const resetError = useCallback(() => {
    setError(null);
    setIsPermissionDenied(false);
  }, []);

  const sendAudioToApi = useCallback(async (base64Data: string, mimeType: string): Promise<string | null> => {
    setIsTranscribing(true);
    setError(null);

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Data,
          mimeType: mimeType.split(';')[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao transcrever áudio com Gemini 3.5 Transcribe.');
      }

      const resultText = data.transcript || '';
      setTranscript(resultText);
      setIsTranscribing(false);
      return resultText;
    } catch (apiErr: any) {
      console.warn('Falha no envio para transcrição:', apiErr?.message);
      setError(apiErr.message || 'Falha ao conectar com o serviço de transcrição Gemini.');
      setIsTranscribing(false);
      return null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setIsPermissionDenied(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Acesso a microfone não suportado pelo seu navegador.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine best audio mime type supported by current browser
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(250); // Slice every 250ms
      setIsRecording(true);
    } catch (err: any) {
      const isDenied =
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError' ||
        (err.message && err.message.toLowerCase().includes('permission denied')) ||
        (err.message && err.message.toLowerCase().includes('denied'));

      if (isDenied) {
        setIsPermissionDenied(true);
        setError(
          'Permissão de microfone negada. Clique no ícone de cadeado do navegador para permitir o microfone, ou envie um arquivo de áudio abaixo.'
        );
      } else {
        setError(err.message || 'Não foi possível iniciar o microfone.');
      }
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }

      recorder.onstop = async () => {
        setIsRecording(false);
        // Release hardware mic track
        try {
          recorder.stream.getTracks().forEach((track) => track.stop());
        } catch {
          // Ignore release errors
        }

        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size === 0) {
          setError('Nenhum dado de áudio gravado.');
          resolve(null);
          return;
        }

        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Data = (reader.result as string).split(',')[1];
              const text = await sendAudioToApi(base64Data, mimeType);
              resolve(text);
            } catch (convErr: any) {
              setError('Falha ao processar arquivo de áudio.');
              setIsTranscribing(false);
              resolve(null);
            }
          };
          reader.onerror = () => {
            setError('Erro ao ler áudio gravado.');
            setIsTranscribing(false);
            resolve(null);
          };
        } catch (procErr: any) {
          setError('Erro inesperado no processamento.');
          setIsTranscribing(false);
          resolve(null);
        }
      };

      recorder.stop();
    });
  }, [sendAudioToApi]);

  const transcribeAudioFile = useCallback(
    async (file: File): Promise<string | null> => {
      resetError();
      setIsTranscribing(true);

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            const mime = file.type || 'audio/mp3';
            const text = await sendAudioToApi(base64Data, mime);
            resolve(text);
          } catch (err: any) {
            setError('Erro ao enviar arquivo para transcrição.');
            setIsTranscribing(false);
            resolve(null);
          }
        };
        reader.onerror = () => {
          setError('Erro ao ler arquivo de áudio selecionado.');
          setIsTranscribing(false);
          resolve(null);
        };
      });
    },
    [resetError, sendAudioToApi]
  );

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isRecording,
    isTranscribing,
    transcript,
    error,
    isPermissionDenied,
    startRecording,
    stopRecording,
    transcribeAudioFile,
    clearTranscript,
    resetError,
  };
}
