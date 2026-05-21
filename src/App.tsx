import { useMemo, useState } from 'react'

type Player = 'X' | 'O'
type SquareValue = Player | null

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const winLineCoordinates = [
  { x1: 10, y1: 16.6667, x2: 90, y2: 16.6667 },
  { x1: 10, y1: 50, x2: 90, y2: 50 },
  { x1: 10, y1: 83.3333, x2: 90, y2: 83.3333 },
  { x1: 16.6667, y1: 10, x2: 16.6667, y2: 90 },
  { x1: 50, y1: 10, x2: 50, y2: 90 },
  { x1: 83.3333, y1: 10, x2: 83.3333, y2: 90 },
  { x1: 12, y1: 12, x2: 88, y2: 88 },
  { x1: 88, y1: 12, x2: 12, y2: 88 },
]

const LIVE_URL = ''
const REPO_URL = ''
const SUBMIT_URL = ''

const createEmptyBoard = () => Array.from({ length: 9 }, () => null as SquareValue)

const calculateWinner = (squares: SquareValue[]) => {
  for (const [lineIndex, line] of winningLines.entries()) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line, lineIndex }
    }
  }
  return { winner: null as SquareValue, line: [] as number[], lineIndex: -1 }
}

function App() {
  const [squares, setSquares] = useState<SquareValue[]>(createEmptyBoard())
  const [xIsNext, setXIsNext] = useState(true)

  const { winner, line, lineIndex } = useMemo(() => calculateWinner(squares), [squares])
  const isDraw = !winner && squares.every(Boolean)
  const currentPlayer: Player = xIsNext ? 'X' : 'O'

  const handleSquareClick = (index: number) => {
    if (winner || squares[index]) return
    const nextSquares = [...squares]
    nextSquares[index] = currentPlayer
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  const resetGame = () => {
    setSquares(createEmptyBoard())
    setXIsNext(true)
  }

  const status = winner
    ? `Player ${winner} wins`
    : isDraw
      ? 'Draw game'
      : `Player ${currentPlayer}'s turn`

  return (
    <div className="min-h-screen px-4 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/40 px-4 py-1 text-sm uppercase tracking-[0.2em] text-slate-300 animate-pulseSoft">
              Neon glass arena
            </span>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
              Tic Tac Toe
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              A modern two-player showdown with live status updates, polished animations,
              and a clean victory flow.
            </p>
          </div>
          <div className="glass-panel flex flex-col gap-3 rounded-3xl px-6 py-5">
            <div className="flex items-center justify-between gap-6 text-sm text-slate-300">
              <span>Current turn</span>
              <span className="rounded-full bg-slate-900/70 px-3 py-1 text-base font-semibold text-white">
                {currentPlayer}
              </span>
            </div>
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                winner
                  ? 'bg-emerald-500/20 text-emerald-200'
                  : isDraw
                    ? 'bg-amber-500/20 text-amber-200'
                    : 'bg-sky-500/15 text-sky-200'
              }`}
              aria-live="polite"
            >
              {status}
            </div>
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="glass-panel relative rounded-[32px] p-6 md:p-8 lg:animate-float">
            <div className="grid-glow relative">
              <div className="grid gap-4 sm:gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Game board</h2>
                    <p className="text-sm text-slate-300">Tap a cell to lock in your move.</p>
                  </div>
                  <button
                    type="button"
                    onClick={resetGame}
                    className="rounded-full border border-slate-600/60 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-300/60 hover:bg-slate-800"
                  >
                    Reset game
                  </button>
                </div>

                <div className="relative">
                  {winner && lineIndex >= 0 ? (
                    <svg
                      className={`win-line ${winner === 'X' ? 'win-line-x' : 'win-line-o'}`}
                      viewBox="0 0 100 100"
                      aria-hidden="true"
                    >
                      <line
                        x1={winLineCoordinates[lineIndex].x1}
                        y1={winLineCoordinates[lineIndex].y1}
                        x2={winLineCoordinates[lineIndex].x2}
                        y2={winLineCoordinates[lineIndex].y2}
                      />
                    </svg>
                  ) : null}

                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {squares.map((value, index) => {
                      const isWinningSquare = line.includes(index)
                      return (
                        <button
                          key={`${index}-${value ?? 'empty'}`}
                          type="button"
                          onClick={() => handleSquareClick(index)}
                          className={`group aspect-square rounded-2xl border border-slate-700/60 bg-slate-950/60 text-3xl font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:border-slate-400/70 hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:text-4xl ${
                            isWinningSquare
                              ? 'border-emerald-400/80 bg-emerald-500/10 shadow-glow'
                              : ''
                          }`}
                          aria-label={`Square ${index + 1}`}
                        >
                          <span
                            className={`inline-flex h-full w-full items-center justify-center rounded-2xl transition ${
                              value === 'X'
                                ? 'text-sky-300'
                                : value === 'O'
                                  ? 'text-amber-300'
                                  : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                          >
                            {value ?? '.'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="glass-panel rounded-[28px] p-6">
              <h3 className="text-xl font-semibold text-white">Match insights</h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/50 px-4 py-3">
                  <span>Moves played</span>
                  <span className="font-semibold text-white">
                    {squares.filter(Boolean).length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/50 px-4 py-3">
                  <span>Board status</span>
                  <span className="font-semibold text-white">
                    {winner ? 'Victory' : isDraw ? 'Stalemate' : 'In progress'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/50 px-4 py-3">
                  <span>Next up</span>
                  <span className="font-semibold text-white">{currentPlayer}</span>
                </div>
              </div>
            </section>

            <section className="glass-panel rounded-[28px] p-6">
              <h3 className="text-xl font-semibold text-white">Submission</h3>
              <p className="mt-2 text-sm text-slate-300">
                Add your live demo and repository links when ready.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-slate-200">
                <a
                  href={LIVE_URL || '#'}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                    LIVE_URL
                      ? 'border-sky-400/60 bg-sky-400/10 text-sky-200 hover:bg-sky-400/20'
                      : 'border-slate-700/60 bg-slate-900/50 text-slate-400 pointer-events-none'
                  }`}
                  aria-disabled={!LIVE_URL}
                >
                  <span>Live hosted link</span>
                  <span>{LIVE_URL ? 'Open' : 'Add link'}</span>
                </a>
                <a
                  href={REPO_URL || '#'}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                    REPO_URL
                      ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
                      : 'border-slate-700/60 bg-slate-900/50 text-slate-400 pointer-events-none'
                  }`}
                  aria-disabled={!REPO_URL}
                >
                  <span>Public GitHub repository link</span>
                  <span>{REPO_URL ? 'Open' : 'Add link'}</span>
                </a>
                <a
                  href={SUBMIT_URL || '#'}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                    SUBMIT_URL
                      ? 'border-amber-400/60 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20'
                      : 'border-slate-700/60 bg-slate-900/50 text-slate-400 pointer-events-none'
                  }`}
                  aria-disabled={!SUBMIT_URL}
                >
                  <span>Submit</span>
                  <span>{SUBMIT_URL ? 'Open' : 'Add link'}</span>
                </a>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
