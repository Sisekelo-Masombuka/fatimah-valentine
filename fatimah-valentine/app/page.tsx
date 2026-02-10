"use client";

import { useEffect, useState } from "react";

type Scene = 1 | 2 | 3 | 4 | 5;

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/uQFVqltOXRg";
const RELATIONSHIP_START = new Date("2025-04-18T00:00:00");
const YES_REDIRECT_URL =
  "https://www.youtube.com/watch?v=uaLV003llhY&list=RDuaLV003llhY&start_radio=1";
const NO_REDIRECT_URL =
  "https://www.youtube.com/watch?v=9rlW2rUzyn0&list=RD9rlW2rUzyn0&start_radio=1";

export default function ValentineJourneyPage() {
  const [currentScene, setCurrentScene] = useState<Scene>(1);
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
  const [answers, setAnswers] = useState<{
    q1?: string;
    q2?: string;
    q3?: string;
    decision?: "yes" | "no";
  }>({});

  const sendReport = (data: {
    q1?: string;
    q2?: string;
    q3?: string;
    decision?: "yes" | "no";
  }) => {
    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    const url = "/api/report";
    const json = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([json], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      }).catch(() => {});
    }
  };

  const recordAnswer = (key: "q1" | "q2" | "q3", value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const recordDecision = (decision: "yes" | "no") => {
    setAnswers((prev) => {
      const updated = { ...prev, decision };
      sendReport(updated);
      return updated;
    });
  };

  const goToNextScene = () => {
    setCurrentScene((prev) => (prev < 5 ? ((prev + 1) as Scene) : prev));
  };

  const goToPrevScene = () => {
    setCurrentScene((prev) => (prev > 1 ? ((prev - 1) as Scene) : prev));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-900 via-rose-800 to-rose-950 text-rose-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-rose-900/60 backdrop-blur-xl border border-rose-700/60 rounded-3xl shadow-2xl shadow-rose-900/40 overflow-hidden">
        <div className="p-5 sm:p-8 md:p-10 space-y-6">
          {currentScene === 1 && (
            <WelcomeScene
              onBegin={goToNextScene}
            />
          )}

          {currentScene === 2 && (
            <MemoriesScene onNext={goToNextScene} onBack={goToPrevScene} />
          )}

          {currentScene === 3 && (
            <QuestionsScene
              answered={answeredQuestions}
              setAnswered={setAnsweredQuestions}
              onReadyForGame={() => setCurrentScene(4)}
              onBack={goToPrevScene}
              onRecordAnswer={recordAnswer}
            />
          )}

          {currentScene === 4 && (
            <MiniGameScene
              onContinue={goToNextScene}
              onBack={goToPrevScene}
            />
          )}

          {currentScene === 5 && (
            <FinalScene onBack={goToPrevScene} onDecision={recordDecision} />
          )}

          {/* Progress indicator */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-rose-200/80 pt-2 border-t border-rose-700/60">
            <span>Step {currentScene} of 5</span>
            <span>Created with love by Sisekelo “Cuba” Masombuka</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function WelcomeScene({ onBegin }: { onBegin: () => void }) {
  const [timeSince, setTimeSince] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    nowText: "",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - RELATIONSHIP_START.getTime();
      const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeSince({
        days,
        hours,
        minutes,
        seconds,
        nowText: now.toLocaleString(),
      });
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-rose-300/80">
            Since 18 April 2025
          </p>
          <p className="text-[11px] sm:text-xs text-rose-200/90">
            {timeSince.days} days •{" "}
            {timeSince.hours.toString().padStart(2, "0")}h{" "}
            {timeSince.minutes.toString().padStart(2, "0")}m{" "}
            {timeSince.seconds.toString().padStart(2, "0")}s together and
            counting
          </p>
          <p className="text-[10px] sm:text-[11px] text-rose-200/60">
            Now: {timeSince.nowText}
          </p>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          Hey, <span className="text-rose-200 font-bold">Fatimah</span>…
        </h1>
        <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
          Today I didn&apos;t just want to send a message. I wanted to build
          you something special a place made of our moments, our laughter, and
          the way you make my heart feel full.
        </p>
        {/* isiZulu line – only here */}
        <p className="text-sm sm:text-base text-rose-100/90 italic">
          Something Smaller Nyana and I hope Uzokujabulela. 
        </p>
      </div>

      {/* Music section */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-rose-100">
          🎵 A song for this moment
        </p>
        <p className="text-xs sm:text-sm text-rose-200/80">
          Press play and let it be the soundtrack while you walk through what I
          built for you.
        </p>
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-rose-700/70 bg-black/40">
          {/* TODO: Replace VIDEO_ID_HERE above with your actual YouTube embed link */}
          <iframe
            className="w-full h-full"
            src={YOUTUBE_EMBED_URL}
            title="Valentine music"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Intro CTA */}
      <div className="space-y-3">
        <p className="text-sm sm:text-base text-rose-100/90">
          When you&apos;re ready, tap below and I&apos;ll take you through a few
          memories, a little game, and one big question I&apos;ve been keeping
          in my heart.
        </p>
        <button
          onClick={onBegin}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-full bg-rose-500 hover:bg-rose-400 text-rose-50 font-medium text-sm sm:text-base shadow-lg shadow-rose-900/50 transition-transform duration-150 hover:-translate-y-0.5"
        >
          Begin our journey
          <span className="ml-2">♥</span>
        </button>
      </div>
    </section>
  );
}

type MemoryMediaType = "image" | "video";

interface MemoryItem {
  title: string;
  hint: string;
  src: string;
  type: MemoryMediaType;
}

const MEMORIES: MemoryItem[] = [
  {
    title: "The first time",
    hint:
      "The very first video we took together the moment I asked you to be my girlfriend.",
    src: "/memories/1-first-video.mp4",
    type: "video",
  },
  {
    title: "Your baby face",
    hint:
      "That picture where you look like a baby and I can’t handle how cute you are.",
    src: "/memories/2-baby-photo.jpg",
    type: "image",
  },
  {
    title: "Hair + massage",
    hint:
      "The video after I finished doing your hair and I was massaging your back you looked so at peace.",
    src: "/memories/3-hair-massage.mp4",
    type: "video",
  },
  {
    title: "Us in bed",
    hint:
      "The screenshot from that video you sent me us laying in bed. You tried not to send the picture, but I kept it anyway.",
    src: "/memories/4-bed-screenshot.jpg",
    type: "image",
  },
];

function MemoriesScene({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <section className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-900/80 border border-rose-600 text-[11px] sm:text-xs text-rose-50 hover:bg-rose-700/80 hover:border-rose-400 transition-colors shadow-sm"
      >
        <span className="text-sm">←</span>
        <span>Back</span>
      </button>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Little snapshots of us
        </h2>
        <p className="text-sm sm:text-base text-rose-100/90">
          I appreciate you for being my girlfriend and I love you for being you.
        </p>
      </div>

      {/* Photo / video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {MEMORIES.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 rounded-2xl border border-rose-700/70 bg-rose-900/50 p-3 sm:p-4"
          >
            {/* Media block – image or video */}
            <div className="w-full rounded-xl bg-black border border-rose-500/60 overflow-hidden">
              {item.type === "image" ? (
                <div className="w-full aspect-[4/3]">
                  {/* Image fills and crops nicely inside */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video">
                  {/* Video fills container; object-cover avoids weird borders */}
                  <video
                    src={item.src}
                    className="h-full w-full object-cover"
                    controls
                  />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-rose-300/80">
                {item.title}
              </p>
              <p className="text-xs sm:text-sm text-rose-100/85">
                {item.hint}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-rose-200/80">
          It is my hope that these memories will remind you of the love we share and the joy we have together.
        </p>
        <button
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-rose-50 font-medium text-sm shadow-lg shadow-rose-900/50 transition-transform duration-150 hover:-translate-y-0.5"
        >
          Continue
        </button>
      </div>
    </section>
  );
}

interface QuestionsSceneProps {
  answered: number;
  setAnswered: (n: number) => void;
  onReadyForGame: () => void;
  onBack: () => void;
  onRecordAnswer: (key: "q1" | "q2" | "q3", value: string) => void;
}

function QuestionsScene({
  answered,
  setAnswered,
  onReadyForGame,
  onBack,
  onRecordAnswer,
}: QuestionsSceneProps) {
  const totalQuestions = 3;

  const handleAnswer = (key: "q1" | "q2" | "q3", value: string) => {
    onRecordAnswer(key, value);
    if (answered < totalQuestions) {
      const next = answered + 1;
      setAnswered(next);
      if (next === totalQuestions) {
        // Slight delay so she sees feedback before jump
        setTimeout(onReadyForGame, 600);
      }
    }
  };

  return (
    <section className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-900/80 border border-rose-600 text-[11px] sm:text-xs text-rose-50 hover:bg-rose-700/80 hover:border-rose-400 transition-colors shadow-sm"
      >
        <span className="text-sm">←</span>
        <span>Back</span>
      </button>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          A few questions, just for fun
        </h2>
        <p className="text-sm sm:text-base text-rose-100/90">
          No right answers, just us. I want you to smile a little and remember
          what we&apos;ve shared so far.
        </p>
      </div>

      <div className="space-y-4">
        {/* Q1 */}
        <QuestionCard
          title="Which moment feels the most 'us'?"
          text="The time we laughed too hard, the quiet moments, or that one random day that still lives rent free in your mind."
          options={[
            "The moment we couldn’t stop laughing",
            "That one deep 3am conversation (Did we have?)",
            "A small, quiet moment only we understand",
          ]}
          onAnswered={(answer) => handleAnswer("q1", answer)}
        />

        {/* Q2 */}
        <QuestionCard
          title="When you think of me, what’s the first word that appears?"
          text="Don’t overthink it. Just the first word that lands on your heart."
          options={["Warm", "Annoying but cute", "Home", "Unexpected"]}
          onAnswered={(answer) => handleAnswer("q2", answer)}
        />

        {/* Q3 */}
        <QuestionCard
          title="How much do you think I like you?"
          text="Be honest. I’m curious what you’ll pick."
          options={[
            "A little",
            "Too much",
            "Way too much",
            "More than you’ll ever really know",
          ]}
          onAnswered={(answer) => handleAnswer("q3", answer)}
        />
      </div>

      <p className="text-xs sm:text-sm text-rose-200/80">
        Answered: {answered} / {totalQuestions}. Once you&apos;ve moved through
        them, I&apos;ll pull you into a tiny game before the real question.
      </p>
    </section>
  );
}

interface QuestionCardProps {
  title: string;
  text: string;
  options: string[];
  onAnswered: (answer: string) => void;
}

function QuestionCard({ title, text, options, onAnswered }: QuestionCardProps) {
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (option: string) => {
    if (!hasAnswered) {
      setSelected(option);
      setHasAnswered(true);
      onAnswered(option);
    } else {
      setSelected(option);
    }
  };

  return (
    <div className="rounded-2xl border border-rose-700/70 bg-rose-900/50 p-4 sm:p-5 space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-semibold text-rose-50">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-rose-100/85">{text}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleClick(opt)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all border ${
              selected === opt
                ? "bg-rose-500 text-rose-50 border-rose-300 shadow-md shadow-rose-900/60"
                : "bg-rose-900/60 text-rose-100/90 border-rose-700 hover:border-rose-400 hover:bg-rose-800/80"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {hasAnswered && (
        <p className="text-xs sm:text-sm text-rose-200/85">
          I love the way your mind works. Whatever you chose says more about us
          than you think.
        </p>
      )}
    </div>
  );
}

function MiniGameScene({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) {
  const totalHearts = 5;
  const [collected, setCollected] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const handleHeartClick = () => {
    if (gameCompleted) return;
    setCollected((prev) => {
      const next = prev + 1;
      if (next >= totalHearts) {
        setGameCompleted(true);
      }
      return next;
    });
  };

  return (
    <section className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-900/80 border border-rose-600 text-[11px] sm:text-xs text-rose-50 hover:bg-rose-700/80 hover:border-rose-400 transition-colors shadow-sm"
      >
        <span className="text-sm">←</span>
        <span>Back</span>
      </button>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          A tiny game before the truth
        </h2>
        <p className="text-sm sm:text-base text-rose-100/90">
          I hid a few hearts in here. Collect them all and you&apos;ll unlock
          what I really brought you here to ask.
        </p>
      </div>

      {/* Game area */}
      <div className="relative w-full h-64 sm:h-72 rounded-3xl border border-rose-700/70 bg-rose-900/60 overflow-hidden">
        {/* Background hint */}
        <p className="absolute inset-x-4 top-4 text-xs sm:text-sm text-rose-200/80">
          Tap or click the drifting hearts to collect them.
        </p>

        {/* Hearts – simple clickable elements laid out loosely */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4">
          {Array.from({ length: totalHearts }).map((_, idx) => (
            <button
              key={idx}
              onClick={handleHeartClick}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-2xl transition-transform duration-150 ${
                collected > idx
                  ? "bg-rose-500 text-rose-50 scale-90 opacity-80"
                  : "bg-rose-700/80 text-rose-100 hover:scale-110 hover:bg-rose-500/90 shadow-md shadow-rose-900/60"
              }`}
            >
              ♥
            </button>
          ))}
        </div>

        {/* Bottom counter */}
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-xs sm:text-sm text-rose-200/85">
          <span>
            Hearts collected: {Math.min(collected, totalHearts)} / {totalHearts}
          </span>
          {gameCompleted && (
            <span className="text-emerald-300">
              You did it. You unlocked my heart.
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-rose-200/80">
          This was just for fun but I meant it. Every heart you clicked is
          just a tiny symbol of the way mine keeps choosing you.
        </p>
        <button
          onClick={onContinue}
          disabled={!gameCompleted}
          className={`w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-full font-medium text-sm shadow-lg shadow-rose-900/50 transition-transform duration-150 ${
            gameCompleted
              ? "bg-rose-500 hover:bg-rose-400 text-rose-50 hover:-translate-y-0.5"
              : "bg-rose-800 text-rose-400 cursor-not-allowed"
          }`}
        >
          {gameCompleted ? "See what I really want to ask" : "Collect all hearts to continue"}
        </button>
      </div>
    </section>
  );
}

function FinalScene({
  onBack,
  onDecision,
}: {
  onBack: () => void;
  onDecision: (decision: "yes" | "no") => void;
}) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [showDance, setShowDance] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  return (
    <>
      {/* Full-screen gentle thank-you with crying gif */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-xl w-full mx-4 rounded-3xl border border-rose-500/80 bg-gradient-to-b from-rose-900 via-rose-800 to-rose-950 px-6 py-8 sm:py-10 text-center shadow-2xl shadow-rose-900/90 space-y-4 sm:space-y-6">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-rose-200/80">
              It&apos;s okay
            </p>
            <p className="text-lg sm:text-2xl font-semibold text-rose-50">
              Thank you for your time, Ms Howard.
            </p>
            <div className="w-full rounded-2xl overflow-hidden bg-black/60 border border-rose-500/70">
              {/* TODO: Put your crying GIF in /public/memories/crying.gif */}
              <div className="w-full aspect-video">
                <img
                  src="/memories/crying.gif"
                  alt="Crying but grateful"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setShowThankYou(false);
                window.location.href = NO_REDIRECT_URL;
              }}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-rose-50 font-medium text-sm shadow-lg shadow-rose-900/70 transition-transform duration-150 hover:-translate-y-0.5"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Full-screen celebration dance (Spider-Man-style) */}
      {showDance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-2xl w-full mx-4 rounded-3xl border border-rose-500/80 bg-gradient-to-b from-rose-900 via-rose-800 to-rose-950 px-6 py-8 sm:py-10 text-center shadow-2xl shadow-rose-900/90 space-y-4 sm:space-y-6">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-rose-200/80">
              She said yes!
            </p>
            <p className="text-lg sm:text-2xl font-semibold text-rose-50">
              My whole heart is doing a little Spider-Man dance right now.
            </p>
            <div className="w-full rounded-2xl overflow-hidden bg-black/60 border border-rose-500/70">
              {/* TODO: Put your Spider-Man dancing GIF or video in /public/memories/spidey-dance.(gif|mp4)
                  and update the src below if needed. */}
              <div className="w-full aspect-video">
                <img
                  src="/memories/spidey-dance.gif"
                  alt="Excited dance animation"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setShowDance(false);
                window.location.href = YES_REDIRECT_URL;
              }}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-rose-50 font-medium text-sm shadow-lg shadow-rose-900/70 transition-transform duration-150 hover:-translate-y-0.5"
            >
              Okay, I&apos;ve celebrated
            </button>
          </div>
        </div>
      )}

      {/* Full-screen pop-up question with raining hearts */}
      {showOverlay && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="relative max-w-xl w-full mx-4 rounded-3xl border border-rose-500/80 bg-gradient-to-b from-rose-900 via-rose-800 to-rose-950 px-6 py-10 text-center shadow-2xl shadow-rose-900/80">
            {/* Heart rain (simple animated hearts) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-2xl sm:text-3xl text-rose-300/80 animate-bounce"
                  style={{
                    left: `${(i * 7) % 100}%`,
                    top: `${(i * 13) % 100}%`,
                    animationDelay: `${(i * 0.15).toFixed(2)}s`,
                  }}
                >
                  ♥
                </span>
              ))}
            </div>

            <div className="relative space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-200/80">
                The real question
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Fatimah Howard,
              </h2>
              <p className="text-xl sm:text-2xl text-rose-50 font-medium">
                will you be my Valentine?
              </p>
              <p className="text-sm sm:text-base text-rose-100/90 max-w-md mx-auto">
                Take a breath, smile a little, and then tap below to see the rest.
              </p>
              <button
                onClick={() => setShowOverlay(false)}
                className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-rose-50 font-medium text-sm shadow-lg shadow-rose-900/70 transition-transform duration-150 hover:-translate-y-0.5"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-900/80 border border-rose-600 text-[11px] sm:text-xs text-rose-50 hover:bg-rose-700/80 hover:border-rose-400 transition-colors shadow-sm"
        >
          <span className="text-sm">←</span>
          <span>Back</span>
        </button>

        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300/80">
            This is the part that matters
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Fatimah Howard,
          </h2>
          <p className="text-xl sm:text-2xl text-rose-50 font-medium">
            will you be my Valentine?
          </p>
          <p className="text-sm sm:text-base text-rose-100/90 max-w-xl mx-auto">
            Not as a random question, not as a last-minute thought but as
            something I&apos;ve been holding onto, building up to, and meaning
            with my whole heart.
          </p>
        </div>

        {/* Final photo / message */}
        <div className="space-y-3">
          <div className="w-full rounded-3xl border border-rose-500/70 overflow-hidden bg-black/40">
            <div className="w-full aspect-[4/3]">
              <img
                src="/memories/favourite.jpg"
                alt="Our favourite photo together"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <p className="text-sm sm:text-base text-rose-100/90 text-center max-w-xl mx-auto">
            This was after our very first proper date, the same night you were
            leaving to go home. I still look at this and think, &quot;This is
            my person.&quot;
          </p>
        </div>

        {/* Yes / No buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onDecision("yes");
              setShowDance(true);
            }}
            className="px-6 sm:px-8 py-3 rounded-full bg-rose-500 hover:bg-rose-400 text-rose-50 font-semibold text-sm sm:text-base shadow-xl shadow-rose-900/60 transition-transform duration-150 hover:-translate-y-0.5"
          >
            Yes, I&apos;ll be your Valentine
          </button>
          <button
            onClick={() => {
              onDecision("no");
              setShowThankYou(true);
            }}
            className="px-4 py-2 rounded-full border border-rose-600/80 text-rose-200/90 text-xs sm:text-sm hover:border-rose-400 hover:text-rose-50 transition-all duration-150"
          >
            (No)
          </button>
        </div>

        {/* Signature */}
        <div className="pt-4 border-t border-rose-700/60 text-center space-y-1 text-xs sm:text-sm text-rose-200/80">
          <p>
            Created by:{" "}
            <span className="font-medium">
              Sisekelo Preach &quot;Cuba&quot; Masombuka
            </span>
          </p>
          <p>Built with code. Delivered with love.</p>
        </div>
      </section>
    </>
  );
}