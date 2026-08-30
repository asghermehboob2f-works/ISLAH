'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onAudioSaved: (audioUrl: string) => void;
  initialAudioUrl?: string;
}

export function VoiceRecorder({ onAudioSaved, initialAudioUrl = '' }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl);
  const [permissionError, setPermissionError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setPermissionError('');
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioUrl(base64Audio);
          onAudioSaved(base64Audio);
        };

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      setPermissionError('Microphone access denied or unavailable. You can type your description instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioUrl('');
    setRecordingTime(0);
    onAudioSaved('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <Mic className="w-4 h-4 text-blue-600" />
          <span>Optional Voice Description</span>
        </label>
        <span className="text-[10px] font-semibold text-slate-400 uppercase">Accessibility Option</span>
      </div>
      <p className="text-[11px] text-slate-500">
        Record a short audio note explaining the issue instead of or in addition to typing details.
      </p>

      {permissionError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Active Recording View */}
      {isRecording && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-xs font-bold text-red-900 font-mono">
              Recording... {formatTime(recordingTime)}
            </span>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Square className="w-3.5 h-3.5 fill-current" /> Stop
          </button>
        </div>
      )}

      {/* Recording Completed Preview */}
      {!isRecording && audioUrl && (
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Voice Note Ready
              </div>
              <audio src={audioUrl} controls className="h-7 mt-1 w-48 sm:w-60" />
            </div>
          </div>

          <button
            type="button"
            onClick={deleteRecording}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Re-record
          </button>
        </div>
      )}

      {/* Default Start Button */}
      {!isRecording && !audioUrl && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full bg-white hover:bg-slate-100 border border-slate-300 font-bold text-xs text-slate-700 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Mic className="w-4 h-4 text-blue-600" />
          <span>Click to Start Voice Recording</span>
        </button>
      )}
    </div>
  );
}
