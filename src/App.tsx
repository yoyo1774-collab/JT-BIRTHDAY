import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { siteContent, type MemoryFolder } from "./content";

const assetUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

gsap.registerPlugin(useGSAP);

type SoundKind = "click" | "signal1" | "signal2" | "success" | "error" | "move";
type BootState = "idle" | "error" | "success" | "april-birthday" | "anniversary";

const loginDataStream = [
  "USER_ALIAS := 比比哥",
  "CALLSIGN := JT",
  "PROFILE := TECH BRO",
  "BIRTH_ORIGIN := 1993.09.17",
  "JT_LOVES_APRIL := TRUE",
  "APRIL_LOVES_JT := INFINITE",
  "SLEEP_MODE := 秒斷電",
  "EAR_PROFILE := 寶寶耳朵 / NOISE_FILTER_ON",
  "APPLE_STORE_VISITS := COUNT_OVERFLOW",
  "LOVE_MODE : 抱抱充電",
  "HUG_LINK := ALWAYS_CONNECTED",
  "STRAIGHT_MAN_PATCH := PENDING",
  "LOVE_SIGNAL := STABLE",
];

function useSound(muted: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  return useCallback((kind: SoundKind) => {
    if (muted) return;
    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = !contextRef.current || contextRef.current.state === "closed"
      ? new AudioContextClass()
      : contextRef.current;
    contextRef.current = ctx;

    const emit = () => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const settings = {
        click: [185, 0.055, "square"],
        signal1: [300, 0.075, "square"],
        signal2: [460, 0.09, "square"],
        success: [540, 0.18, "sine"],
        error: [82, 0.14, "sawtooth"],
        move: [240, 0.06, "triangle"],
      } as const;
      const [frequency, duration, wave] = settings[kind];
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      if (kind === "success") oscillator.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(kind === "error" ? 0.08 : 0.11, ctx.currentTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    };

    if (ctx.state === "suspended") void ctx.resume().then(emit).catch(() => undefined);
    else emit();
  }, [muted]);
}

function Puppy({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`puppy ${compact ? "puppy--compact" : ""}`} aria-hidden="true">
      <span className="puppy__ear puppy__ear--left" />
      <span className="puppy__ear puppy__ear--right" />
      <span className="puppy__face">
        <span className="puppy__eye puppy__eye--left" />
        <span className="puppy__eye puppy__eye--right" />
        <span className="puppy__nose" />
        <span className="puppy__mouth" />
      </span>
    </span>
  );
}

function FinalPhoto() {
  const [failed, setFailed] = useState(false);
  return (
    <span className="final-photo__placeholder">
      {!failed ? (
        <img src={assetUrl("/photos/memories/memory-29.jpg")} alt="我們最喜歡的一張主視覺合照" onError={() => setFailed(true)} />
      ) : (
        <>
          <img
            className="final-photo__mascot"
            src={assetUrl("/pochacco/praying.gif")}
            alt="閉著眼睛許願的 Pochacco"
          />
          <b>WAITING FOR OUR PHOTO</b>
          <small>/photos/final.jpg</small>
        </>
      )}
    </span>
  );
}

function SoundButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      className="sound-button"
      type="button"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? "開啟操作音效" : "關閉操作音效"}
    >
      <span aria-hidden="true">{muted ? "×" : "◖"}</span>
      {muted ? "SOUND OFF" : "SOUND ON"}
    </button>
  );
}

function BootScreen({
  onUnlock,
  play,
  muted,
  onToggleSound,
}: {
  onUnlock: () => void;
  play: (kind: SoundKind) => void;
  muted: boolean;
  onToggleSound: () => void;
}) {
  const [pin, setPin] = useState("");
  const [state, setState] = useState<BootState>("idle");
  const [showMeme, setShowMeme] = useState(false);
  const bootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLInputElement>(null);

  const { contextSafe } = useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      animate: "(prefers-reduced-motion: no-preference)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduceMotion) return;

      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
      intro
        .from(".boot__terminal", { autoAlpha: 0, scaleY: 0.04, duration: 0.38, transformOrigin: "50% 50%" })
        .from(".login-machine__serial span", { autoAlpha: 0, stagger: 0.08, duration: 0.2 })
        .from(".boot__device", { autoAlpha: 0, duration: 0.36 }, "-=0.16")
        .from(".pin-form", { autoAlpha: 0, duration: 0.3 }, "-=0.14");

      const scanner = gsap.fromTo(".pixel-terminal__scan", { yPercent: -150 }, {
        yPercent: 650,
        duration: 2.15,
        repeat: -1,
        ease: "none",
      });

      const cursorPulse = gsap.to(".pixel-terminal__cursor", {
        autoAlpha: 0.15,
        duration: 0.16,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });

      return () => {
        intro.kill();
        scanner.kill();
        cursorPulse.kill();
      };
    });

    return () => media.revert();
  }, { scope: bootRef });

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".pixel-terminal__screen-copy", { autoAlpha: 0.28, x: -5 }, {
      autoAlpha: 1,
      x: 0,
      duration: 0.16,
      ease: "power2.out",
    });
  }, { scope: bootRef, dependencies: [pin, state] });

  const changePin = contextSafe((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextPin = event.target.value.replace(/\D/g, "").slice(0, 4);
    const previousLength = pin.length;
    setState("idle");
    setPin(nextPin);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && nextPin.length > previousLength) {
      const counter = bootRef.current?.querySelector<HTMLElement>(".pin-form__tape-counter");
      if (counter) {
        gsap.fromTo(
          counter,
          { scale: 1.16, color: "#f5c95d" },
          { scale: 1, color: "#8ba7a5", duration: 0.2, ease: "back.out(2)" }
        );
      }
    }
  });

  const submit = contextSafe((event: React.FormEvent) => {
    event.preventDefault();
    if (state === "success") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (pin === siteContent.passcode) {
      setState("success");
      play("success");

      if (reduceMotion) {
        window.setTimeout(onUnlock, 1000);
        return;
      }

      gsap.timeline({ onComplete: onUnlock })
        .to(".pixel-terminal__screen-copy", {
          color: "#f6f0dd",
          textShadow: "0 0 12px #8fe3c5",
          duration: 0.12
        })
        .to(".boot__auth-scan", {
          autoAlpha: 1,
          scaleX: 1,
          duration: 0.14,
          ease: "power2.out"
        }, "<0.08")
        .to(".pixel-terminal__screen-copy", { duration: 1 })
        .to(".boot__terminal", {
          scaleY: 0.025,
          filter: "brightness(2.5)",
          transformOrigin: "50% 50%",
          duration: 0.38,
          ease: "power4.in",
        }, "+=0.12")
        .to(".boot__terminal", {
          scaleX: 0.07,
          duration: 0.16,
          ease: "power3.in"
        })
        .to(bootRef.current, {
          autoAlpha: 0,
          duration: 0.14
        });

    } else if (pin === "0409" || pin === "0305") {
      setState(pin === "0409" ? "april-birthday" : "anniversary");
      play("signal2");

      if (!reduceMotion) {
        gsap.fromTo(
          ".pixel-terminal__screen-copy",
          { filter: "brightness(2)" },
          {
            filter: "brightness(1)",
            duration: 0.34,
            ease: "steps(4)",
            clearProps: "filter"
          }
        );
      }

    } else {
      setState("error");
      play("error");
      setPin("");
      window.setTimeout(() => setShowMeme(true), reduceMotion ? 0 : 450);

      if (!reduceMotion) {
        gsap.timeline()
          .fromTo(
            ".pixel-terminal__screen",
            { filter: "brightness(2.4) saturate(.4)" },
            {
              filter: "brightness(1) saturate(1)",
              duration: 0.28,
              ease: "steps(4)"
            }
          )
          .to(".pin-form input", {
            borderColor: "#ff3f36",
            boxShadow: "0 0 18px rgba(255,63,54,.5)",
            duration: 0.08
          }, "<")
          .to(".pin-form input", {
            borderColor: "#8fe3c5",
            boxShadow: "0 0 0 rgba(255,63,54,0)",
            duration: 0.22
          })
          .set(".pixel-terminal__screen", { clearProps: "filter" });
      }
    }
  });

  const screenTitle =
    state === "success" ? "JT_S_APRIL := CONFIRMED"
      : state === "april-birthday" ? "APRIL_BIRTHDAY := 04.09"
        : state === "anniversary" ? "RELATIONSHIP_START := 03.05"
          : "UNAUTHORIZED LINK // JT";

  const screenMain =
    state === "error" ? "ACCESS DENIED"
      : state === "success" ? "ACCESS GRANTED"
        : state === "april-birthday" ? "MEMORY PATCHED"
          : state === "anniversary" ? "LOVE ARCHIVE FOUND"
            : `JT:\\> ${pin.padEnd(4, "_")}`;

  const screenDetail =
    state === "success" ? "WELCOME BACK, 比比哥"
      : state === "error" ? "比比哥又忘記重要日期？"
        : state === "april-birthday" ? "你好棒棒，你要幫我過很多個生日耶"
          : state === "anniversary" ? "APRIL × JT // ANNIVERSARY"
            : "ACCESS OWNER : APRIL";

  const statusText =
    state === "error" ? "ACCESS DENIED // 比比哥又忘記重要日期？"
      : state === "success" ? "JT_LOVES_APRIL := CONFIRMED"
        : state === "april-birthday" ? "SPECIAL SIGNAL // APRIL 的生日，這次有記得"
          : state === "anniversary" ? "SPECIAL SIGNAL // 我們在一起的紀念日"
            : "HINT := 四位密碼";

  return (
    <main ref={bootRef} className={`boot ${state === "error" ? "boot--error" : ""}`}>
      <div className="boot__glow" />

      <div className="boot__matrix" aria-hidden="true">
        {[0, 1, 2, 3].map((column) => (
          <div className="boot__matrix-column" key={column}>
            {[...loginDataStream, ...loginDataStream, ...loginDataStream, ...loginDataStream].map(
              (line, index) => (
                <span key={`${column}-${index}`}>{line}</span>
              )
            )}
          </div>
        ))}
      </div>

      <div className="boot__auth-scan" aria-hidden="true" />

      <section className="boot__terminal hacker-login" aria-label="生日登入主機">
        <div className="login-machine__serial" aria-hidden="true">
          <span>BIRTHDAY TERMINAL // JT.0917</span>
          <span>APRIL × JT // PRIVATE CHANNEL</span>
        </div>

        <div className="login-machine">
          <div className="boot__device" aria-hidden="true">
            <div className="pixel-terminal">

              <img
                className="pixel-terminal__art"
                src={assetUrl("/pochacco/login-hacker-terminal-v2.png?v=20260902")}
                alt=""
              />

              <div className="pixel-terminal__screen">
                <div className="pixel-terminal__data-stream">
                  {[0, 1].map((copy) => (
                    <div className="pixel-terminal__data-set" key={copy}>
                      {loginDataStream.map((line) => (
                        <span key={`${copy}-${line}`}>{line}</span>
                      ))}
                    </div>
                  ))}
                </div>

                <span className="pixel-terminal__scan" />

                <div className={`pixel-terminal__screen-copy pixel-terminal__screen-copy--${state}`}>
                  <span>{screenTitle}</span>
                  <b>{screenMain}</b>
                  <small>
                    {screenDetail}
                    <i className="pixel-terminal__cursor" />
                  </small>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="pin-form">
            <div className="pin-form__hardware-strip">
              <span
                className={`pin-form__led ${
                  state === "success"
                    ? "is-online"
                    : state === "error"
                      ? "is-error"
                      : state === "april-birthday" || state === "anniversary"
                        ? "is-special"
                        : ""
                }`}
                aria-hidden="true"
              />

              <span className="pin-form__channel">
                PAIRING PROTOCOL // ACTIVE
              </span>

              <span className="pin-form__tape-counter" aria-hidden="true">
                TAPE {String(pin.length).padStart(2, "0")}/04
              </span>

              <span className="login-sound-slot">
                <SoundButton muted={muted} onToggle={onToggleSound} />
              </span>
            </div>

            <div className="pin-form__heading">
              <label htmlFor="passcode">ENTER BIRTH SIGNAL</label>
              <span aria-hidden="true">AUTH KEY // MMDD</span>
            </div>

            <div className="pin-form__row">
              <input
                ref={pinRef}
                id="passcode"
                value={pin}
                onChange={changePin}
                inputMode="numeric"
                autoComplete="off"
                placeholder="_ _ _ _"
                aria-describedby="pin-status"
                aria-invalid={state === "error"}
                autoFocus
                disabled={state === "success"}
              />

              <button type="submit" disabled={state === "success"}>
                BREACH <span aria-hidden="true">↵</span>
              </button>
            </div>

            <p id="pin-status" className="pin-form__status" aria-live="polite">
              {statusText}
            </p>
          </form>

          <div className="login-machine__feet" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>
      </section>

      {showMeme && (
        <MemeAlert
          onClose={() => {
            setShowMeme(false);
            window.requestAnimationFrame(() => pinRef.current?.focus());
          }}
          play={play}
        />
      )}
    </main>
  );
}

function FolderCard({
  folder,
  onOpen,
}: {
  folder: MemoryFolder;
  onOpen: () => void;
}) {
  return (
    <button
      className={`folder folder--${folder.color}`}
      type="button"
      onClick={onOpen}
      aria-label={`開啟${folder.title}，共 ${folder.memories.length} 段回憶`}
    >
      <span className="folder__tab">{folder.code}</span>

      <img className="folder__mascot" src={folder.mascot} alt="" />

      <span className="folder__line">
        <span>{folder.date}</span>
        <span>{String(folder.memories.length).padStart(2, "0")} TRACKS</span>
      </span>

      <strong>{folder.title}</strong>

      <span className="folder__hint">{folder.hint}</span>

      <span className="folder__open">
        OPEN FILE <b>↗</b>
      </span>
    </button>
  );
}

function MemoryModal({
  folder,
  onClose,
  play,
}: {
  folder: MemoryFolder;
  onClose: () => void;
  play: (kind: SoundKind) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [failed, setFailed] = useState(false);

  const item = folder.memories[index];

  useEffect(() => {
    setFailed(false);
    setFlipped(false);
  }, [index]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const move = (direction: number) => {
    setIndex(
      (current) =>
        (current + direction + folder.memories.length) %
        folder.memories.length
    );
    play("move");
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="memory-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-title"
      >
        <header className="memory-modal__header">
          <div>
            <span>{folder.code} // PLAYBACK</span>
            <h2 id="memory-title">{folder.title}</h2>
          </div>

          <button type="button" onClick={onClose} aria-label="關閉回憶視窗">
            CLOSE ×
          </button>
        </header>

        <div className="cassette-slot" aria-hidden="true">
          <span className="cassette-slot__tape">
            MEMORY TAPE // {folder.code}
          </span>
        </div>

        <div className="memory-modal__body">
          <button
            className={`photo-card ${
              flipped ? "photo-card--flipped" : ""
            }`}
            type="button"
            onClick={() => {
              setFlipped((value) => !value);
              play("click");
            }}
            aria-label={flipped ? "顯示照片" : "翻面閱讀回憶文字"}
          >
            <span className="photo-card__inner">
              <span className="photo-card__front">
                {!failed &&
                  (item.kind === "video" ? (
                    <video
                      src={item.image}
                      aria-label={item.alt}
                      autoPlay
                      muted
                      loop
                      playsInline
                      onError={() => setFailed(true)}
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.alt}
                      onError={() => setFailed(true)}
                    />
                  ))}

                {failed && (
                  <span className="photo-placeholder">
                    <i>＋</i>
                    <b>INSERT PHOTO</b>
                    <small>{item.image}</small>
                  </span>
                )}

                <span className="photo-card__caption">
                  {item.caption}
                </span>

                <span className="photo-card__flip">
                  點一下，翻到背面
                </span>
              </span>

              <span className="photo-card__back">
                <span>RECORDED MESSAGE</span>
                <p>{item.note}</p>
                <small>點一下回到照片</small>
              </span>
            </span>
          </button>

          <aside className="tape-deck">
            <p className="eyebrow">NOW PLAYING</p>

            <div className="counter">
              {String(index + 1).padStart(2, "0")}
              <small>
                {" "}
                / {String(folder.memories.length).padStart(2, "0")}
              </small>
            </div>

            <div className="reels" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>

            <p className="tape-deck__note">{item.note}</p>

            <div className="transport">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="上一張照片"
              >
                ◀◀
              </button>

              <button
                type="button"
                onClick={() => setFlipped((value) => !value)}
                aria-label="翻轉照片"
              >
                ●
              </button>

              <button
                type="button"
                onClick={() => move(1)}
                aria-label="下一張照片"
              >
                ▶▶
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function LoveSignal({ onReplay }: { onReplay: () => void }) {
  return (
    <section className="love-signal" aria-labelledby="love-title">
      <div className="love-signal__wave" aria-hidden="true">
        ♡﹏♡﹏♡﹏♡﹏♡
      </div>

      <p className="eyebrow">
        HIDDEN CHANNEL FOUND // {siteContent.birthday}
      </p>

      <h2 id="love-title">
        HAPPY BIRTHDAY
        <br />
        JONATHAN
      </h2>

      <div className="love-signal__grid">
        <div className="final-photo">
          <FinalPhoto />

          <p>
            TO: {siteContent.recipient.fullName}
            <br />
            NICKNAME: {siteContent.recipient.nickname}
            <br />
            CALLSIGN: {siteContent.recipient.callsign}
            <br />
            BORN: {siteContent.birthday}
            <br />
            FROM: {siteContent.fromName}
          </p>
        </div>

        <article className="letter">
          {siteContent.letter.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <span className="letter__sign">
            {siteContent.senderName} // 永遠愛你的人 ♡
          </span>
        </article>
      </div>

      <button
        className="replay-button"
        type="button"
        onClick={onReplay}
      >
        再播放一次 <span>↺</span>
      </button>
    </section>
  );
}

const DOS_BIRTHDAY_MESSAGE = [
  "C:\\LOVE> RUN BIRTHDAY.EXE",
  "",
  "TARGET: JT / 比比哥",
  "TECH BRO MODE: DETECTED",
  "APRIL PRIORITY: MAX",
  "LOVE STATUS: OVERFLOW",
  "",
  "HAPPY BIRTHDAY JT",
  "LOVE YOU",
  "",
  "        i  i  i",
  "       |:||:||:|",
  "     __|______|__",
  "    |            |",
  "  __| 1993.09.17 |__",
  " |                  |",
  " |__________________|",
  "",
  "APRIL  2026.09.17",
].join("\n");

function DosEngineerSequence({ onExit }: { onExit: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!outputRef.current) return;

    const media = gsap.matchMedia();

    media.add({
      animate: "(prefers-reduced-motion: no-preference)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const reduceMotion = Boolean(context.conditions?.reduceMotion);

      if (reduceMotion) {
        outputRef.current!.textContent = DOS_BIRTHDAY_MESSAGE;
        return;
      }

      const typeState = { characters: 0 };
      const typingDuration = DOS_BIRTHDAY_MESSAGE.length * 0.054;
      const handCycleDuration = 0.3;
      const handCycles = Math.ceil(typingDuration / handCycleDuration);

      const typingFrames = gsap.timeline({
        repeat: handCycles - 1
      });

      typingFrames
        .set(".dos-frame--left", { autoAlpha: 1 })
        .set(".dos-frame--right", { autoAlpha: 0 }, "<")
        .to({}, { duration: handCycleDuration / 2 })
        .set(".dos-frame--left", { autoAlpha: 0 })
        .set(".dos-frame--right", { autoAlpha: 1 }, "<")
        .to({}, { duration: handCycleDuration / 2 });

      const master = gsap.timeline({
        repeat: -1
      });

      master
        .call(() => {
          typeState.characters = 0;
          outputRef.current!.textContent = "";
        })
        .addLabel("typing")
        .to(typeState, {
          characters: DOS_BIRTHDAY_MESSAGE.length,
          duration: typingDuration,
          ease: "none",
          snap: { characters: 1 },
          onUpdate: () => {
            outputRef.current!.textContent =
              DOS_BIRTHDAY_MESSAGE.slice(0, typeState.characters);
          },
        }, "typing")
        .add(typingFrames, "typing")
        .to({}, { duration: 1.9 });

      return () => master.kill();
    });

    return () => media.revert();
  }, { scope: stageRef });

  useEffect(() => {
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit();
    };

    window.addEventListener("keydown", exitOnEscape);

    return () =>
      window.removeEventListener("keydown", exitOnEscape);
  }, [onExit]);

  return (
    <button
      className="dos-mode"
      type="button"
      onClick={onExit}
      aria-label="退出 Pochacco 工程師 DOS 動畫"
    >
      <div className="dos-stage" ref={stageRef}>
        <img
          src={assetUrl("/pochacco/dos-engineer.png")}
          alt=""
        />

        <img
          className="dos-frame dos-frame--left"
          src={assetUrl("/pochacco/dos-typing-left.png")}
          alt=""
          aria-hidden="true"
        />

        <img
          className="dos-frame dos-frame--right"
          src={assetUrl("/pochacco/dos-typing-right.png")}
          alt=""
          aria-hidden="true"
        />

        <div
          className="dos-screen"
          aria-label="HAPPY BIRTHDAY JT! LOVE YOU. APRIL. 2026.09.17"
        >
          <div className="dos-screen__title">
            JT-DOS 9.17 // APRIL LOVE SYSTEM
          </div>

          <div
            className="dos-typewriter"
            aria-hidden="true"
          >
            <pre>
              <span ref={outputRef} />
              <span className="dos-typewriter__cursor">
                █
              </span>
            </pre>
          </div>

          <i className="dos-screen__glare" />
        </div>

        <span className="dos-keypress dos-keypress--one" />
        <span className="dos-keypress dos-keypress--two" />
      </div>

      <span className="dos-mode__exit">
        CLICK ANYWHERE TO EXIT // ESC
      </span>
    </button>
  );
}

function BirthdayTransmission({
  play,
}: {
  play: (kind: SoundKind) => void;
}) {
  const [candles, setCandles] = useState(0);
  const [engineerSequence, setEngineerSequence] =
    useState(false);

  const complete = candles === 3;

  const lightNextCandle = () => {
    if (complete) {
      setCandles(0);
      play("move");
      return;
    }

    const next = candles + 1;
    setCandles(next);

    if (next === 3) {
      setEngineerSequence(true);
    }

    play(next === 3 ? "success" : "click");
  };

  return (
    <>
      <section
        className={`birthday-transmission ${
          complete ? "birthday-transmission--complete" : ""
        }`}
        aria-labelledby="birthday-title"
      >
        <div
          className="birthday-transmission__signal"
          aria-hidden="true"
        >
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} />
          ))}
        </div>

        <div className="birthday-transmission__copy">
          <p className="eyebrow">
            BIRTHDAY TRANSMISSION // PRIORITY RED
          </p>

          <h2 id="birthday-title">
            第 {siteContent.birthdayAge} 次
            <br />
            繞行紀念日
          </h2>

          <p>
            {siteContent.birthday}，宇宙第一次收到譚墨彤的訊號。
            趕快對著蛋糕許願吧。
          </p>

          <div
            className="birthday-stats"
            aria-label="生日資料"
          >
            <span>
              <b>1993</b>
              <small>ORIGIN YEAR</small>
            </span>

            <span>
              <b>09.17</b>
              <small>SIGNAL DATE</small>
            </span>

            <span>
              <b>{siteContent.birthdayAge}</b>
              <small>ORBIT COUNT</small>
            </span>
          </div>
        </div>

        <div className="wish-console">
          <button
            type="button"
            className="birthday-character"
            onClick={lightNextCandle}
            aria-label={
              complete
                ? "重新播放壽星 Pochacco 的生日蠟燭"
                : `點燃壽星 Pochacco 蛋糕的第 ${
                    candles + 1
                  } 根蠟燭`
            }
          >
            <img
              src={assetUrl("/pochacco/birthday-jt.png")}
              alt="戴著生日帽、捧著電子蛋糕的壽星版 Pochacco"
            />

            <span
              className="birthday-character__candles"
              aria-hidden="true"
            >
              {[0, 1, 2].map((index) => (
                <i
                  className={
                    index < candles ? "is-lit" : ""
                  }
                  key={index}
                >
                  <b />
                </i>
              ))}
            </span>

            <span
              className="birthday-character__label"
              aria-hidden="true"
            >
              JT // {siteContent.birthdayAge}
            </span>
          </button>

          <p aria-live="polite">
            {complete
              ? "MAKE A WISH // 願望已寫入"
              : `IGNITION ${candles}/3 // 點亮電子蠟燭`}
          </p>
        </div>
      </section>

      {engineerSequence && (
        <DosEngineerSequence
          onExit={() => setEngineerSequence(false)}
        />
      )}
    </>
  );
}

function MemeAlert({
  onClose,
  play,
}: {
  onClose: () => void;
  play: (kind: SoundKind) => void;
}) {
  const alertRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.timeline()
      .fromTo(
        ".meme-alert__flash",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.06,
          repeat: 3,
          yoyo: true
        }
      )
      .from(
        ".meme-alert__panel",
        {
          autoAlpha: 0,
          scale: 0.18,
          y: 140,
          rotation: -7,
          duration: 0.42,
          ease: "back.out(1.7)"
        },
        0.08
      )
      .from(
        ".meme-alert__line",
        {
          autoAlpha: 0,
          x: -18,
          stagger: 0.07,
          duration: 0.15,
          ease: "power2.out"
        },
        0.3
      );
  }, { scope: alertRef });

  useEffect(() => {
    alertRef.current?.focus();

    const closeOnKey = () => {
      play("click");
      onClose();
    };

    window.addEventListener("keydown", closeOnKey, {
      once: true
    });

    return () =>
      window.removeEventListener("keydown", closeOnKey);
  }, [onClose, play]);

  const close = () => {
    play("click");
    onClose();
  };

  return (
    <section
      ref={alertRef}
      className="meme-alert"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meme-title"
      tabIndex={-1}
      onClick={close}
    >
      <span
        className="meme-alert__flash"
        aria-hidden="true"
      />

      <div className="meme-alert__panel">
        <p
          className="meme-alert__warning"
          id="meme-title"
        >
          UNAUTHORIZED USER DETECTED
        </p>

        <img
          src={assetUrl("/meme/meme.png")}
          alt="Pochacco 說自己靠幽默追到十分女友的迷因"
        />

        <div
          className="meme-alert__terminal"
          aria-label="JT 幽默分析結果"
        >
          <span className="meme-alert__line">
            ANALYZING JT...
          </span>

          <span className="meme-alert__line">
            HUMOR LEVEL ........ 100%
          </span>

          <span className="meme-alert__line">
            RIZZ METHOD ......... BEING FUNNY
          </span>

          <span className="meme-alert__line">
            RESULT .............. PULLED A 10/10
          </span>

          <span className="meme-alert__line">
            APRIL VERIFIED ...... YES ✓
          </span>
        </div>

        <small>點擊任意位置，逃離現場</small>
      </div>
    </section>
  );
}

function Desktop({
  play,
  muted,
}: {
  play: (kind: SoundKind) => void;
  muted: boolean;
}) {
  const [folder, setFolder] =
    useState<MemoryFolder | null>(null);

  const [puppyClicks, setPuppyClicks] = useState(0);
  const [showLove, setShowLove] = useState(false);

  const riderRef = useRef<HTMLButtonElement>(null);
  const letterBgmRef = useRef<HTMLAudioElement>(null);

  const { contextSafe } = useGSAP(
    () => {},
    { scope: riderRef }
  );

  const animateRiderTap = contextSafe((level: number) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bike = riderRef.current?.querySelector("img");
    const shockwave =
      riderRef.current?.querySelector(
        ".rider-console__shockwave"
      );
    const label =
      riderRef.current?.querySelector(
        ".rider-console__label"
      );
    const pip =
      riderRef.current?.querySelector(
        `.rider-console__speed i:nth-child(${level})`
      );

    if (!bike || !shockwave || !label || !pip) return;

    gsap.killTweensOf([
      bike,
      shockwave,
      label,
      pip
    ]);

    gsap.timeline()
      .to(bike, {
        x: 12,
        scale: 1.04,
        duration: 0.09,
        ease: "power2.out",
        overwrite: "auto"
      })
      .to(bike, {
        x: 0,
        scale: 1,
        duration: 0.17,
        ease: "power2.out",
        clearProps: "transform"
      })
      .fromTo(
        shockwave,
        {
          scale: 0.55,
          autoAlpha: 0.9
        },
        {
          scale: 1.45,
          autoAlpha: 0,
          duration: 0.38,
          ease: "power2.out"
        },
        0
      )
      .fromTo(
        pip,
        {
          scale: 0,
          autoAlpha: 0
        },
        {
          scale: 1.55,
          autoAlpha: 1,
          duration: 0.12,
          ease: "back.out(2.2)"
        },
        0
      )
      .to(pip, {
        scale: 1,
        duration: 0.08,
        ease: "power1.out"
      })
      .to(
        label,
        {
          x: 4,
          duration: 0.07,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
          clearProps: "transform"
        },
        0
      );
  });

  const tapPuppy = () => {
    const next = Math.min(puppyClicks + 1, 3);

    setPuppyClicks(next);

    animateRiderTap(next);

    play(
      next === 1
        ? "signal1"
        : next === 2
          ? "signal2"
          : "success"
    );

    // Start the Letter BGM directly on the third user click.
    // Keep a fixed audible volume first; no GSAP volume tween.
    if (next === 3 && !muted) {
      const bgm = letterBgmRef.current;

      if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
        bgm.volume = 0.35;

        void bgm.play().catch((error) => {
          console.error("LETTER_BGM_PLAY_FAILED", error);
        });
      }
    }
  };

  useEffect(() => {
    if (puppyClicks < 3) return;

    setShowLove(true);

    const timer = window.setTimeout(() => {
      document
        .getElementById("love-signal")
        ?.scrollIntoView({
          behavior: "smooth"
        });

      setPuppyClicks(0);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [puppyClicks, muted]);

  useEffect(() => {
    const bgm = letterBgmRef.current;
    if (!bgm) return;

    if (muted) {
      bgm.pause();
      return;
    }

    if (showLove) {
      bgm.volume = 0.35;

      void bgm.play().catch((error) => {
        console.error("LETTER_BGM_RESUME_FAILED", error);
      });
    }
  }, [muted, showLove]);

  const replay = () => {
    const bgm = letterBgmRef.current;

    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
      bgm.volume = 0.35;
    }

    setShowLove(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <main className="desktop">
      <audio
        ref={letterBgmRef}
        src={assetUrl("/audio/letter-bgm.mp3")}
        preload="auto"
      />
      <header className="desktop__header">
        <div className="brand">
          <span className="brand__mark">
            JT
          </span>

          <span>
            <b>SIGNAL // 0917</b>
            <small>BIRTHDAY TERMINAL</small>
          </span>
        </div>

        <div className="system-status">
          <span className="status-light" />
          {siteContent.recipient.callsign} // ONLINE
          <i />
          {siteContent.birthday}
        </div>
      </header>

      <div className="neo-ticker">
        <span>
          {siteContent.recipient.callsign} MEMORY GRID
        </span>

        <i aria-hidden="true" />

        <span>
          {siteContent.recipient.fullName}
        </span>

        <i aria-hidden="true" />

        <span>
          EMOTIONAL DATA: STABLE
        </span>

        <i aria-hidden="true" />

        <span>
          PRIVATE CHANNEL ACTIVE
        </span>
      </div>

      <section
        className="hero"
        aria-labelledby="archive-title"
      >
        <div className="hero__copy">
          <p className="eyebrow">
            SECURITY ALERT // UNAUTHORIZED
          </p>

          <h1 id="archive-title">
            <span className="hero__name">
              USER ID {siteContent.recipient.name}
            </span>

            你的記憶，
            <br />
            已遭入侵。
          </h1>

          <p>
            THREAT LEVEL：APRIL
          </p>

          <p>
            任務：強制回放你不准忘記的片段。
          </p>
        </div>

        <button
          ref={riderRef}
          className="rider-console"
          type="button"
          onClick={tapPuppy}
          aria-label={`秘密訊號按鈕，已點擊 ${puppyClicks} 次`}
        >
          <span
            className="rider-console__shockwave"
            aria-hidden="true"
          />

          <img
            src={assetUrl("/pochacco/neo-tokyo-rider.png")}
            alt=""
          />

          <span className="rider-console__label">
            <b>
              HACKER // {siteContent.recipient.callsign}-93
            </b>

            <small>
              {puppyClicks
                ? `SECRET INPUT ${puppyClicks}/3`
                : "TOUCH TO BOOST SIGNAL"}
            </small>
          </span>

          <span
            className="rider-console__speed"
            aria-hidden="true"
          >
            {[0, 1, 2].map((index) => (
              <i
                className={
                  index < puppyClicks
                    ? "is-active"
                    : ""
                }
                key={index}
              />
            ))}
          </span>
        </button>
      </section>

      <BirthdayTransmission play={play} />

      <section
        className="archive"
        aria-labelledby="folders-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              ARCHIVE DIRECTORY
            </p>

            <h2 id="folders-title">
              記憶檔案庫
            </h2>
          </div>

          <span>
            05 TAPES /{" "}
            {siteContent.folders.reduce(
              (total, current) =>
                total + current.memories.length,
              0
            )}{" "}
            TRACKS
          </span>
        </div>

        <div className="folder-grid">
          {siteContent.folders.map((item) => (
            <FolderCard
              key={item.id}
              folder={item}
              onOpen={() => {
                setFolder(item);
                play("click");
              }}
            />
          ))}
        </div>
      </section>

      <footer className="desktop__footer">
        <span>END OF DIRECTORY</span>

        <span>
          小提示：有些訊號，需要多一點耐心才會出現。
        </span>

        <span>0917</span>
      </footer>

      {showLove && (
        <div id="love-signal">
          <LoveSignal onReplay={replay} />
        </div>
      )}

      {folder && (
        <MemoryModal
          folder={folder}
          onClose={() => setFolder(null)}
          play={play}
        />
      )}
    </main>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  const [muted, setMuted] = useState(
    () =>
      sessionStorage.getItem(
        "love-signal-muted"
      ) === "true"
  );

  const play = useSound(muted);

  const toggleMuted = () => {
    setMuted((value) => {
      sessionStorage.setItem(
        "love-signal-muted",
        String(!value)
      );

      return !value;
    });
  };

  return (
    <div className="app-shell">
      <div
        className="scanlines"
        aria-hidden="true"
      />

      {unlocked && (
        <SoundButton
          muted={muted}
          onToggle={toggleMuted}
        />
      )}

      {unlocked ? (
        <Desktop play={play} muted={muted} />
      ) : (
        <BootScreen
          onUnlock={() => setUnlocked(true)}
          play={play}
          muted={muted}
          onToggleSound={toggleMuted}
        />
      )}
    </div>
  );
}
