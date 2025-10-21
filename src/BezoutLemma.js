import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Award, Calculator, Sparkles } from 'lucide-react';

const BezoutLemma = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showHints, setShowHints] = useState({});
  const [completedLevels, setCompletedLevels] = useState([]);
  const [interactiveState, setInteractiveState] = useState({});

  // Extended Euclidean Algorithm calculator
  const extendedGCD = (a, b) => {
    const steps = [];
    let oldR = a, r = b;
    let oldS = 1, s = 0;
    let oldT = 0, t = 1;
    
    steps.push({ r: oldR, s: oldS, t: oldT, q: '', equation: `Start: a = ${a}, b = ${b}` });
    
    while (r !== 0) {
      const q = Math.floor(oldR / r);
      const newR = oldR - q * r;
      const newS = oldS - q * s;
      const newT = oldT - q * t;
      
      steps.push({
        r: r,
        s: s,
        t: t,
        q: q,
        equation: `${oldR} = ${q} × ${r} + ${newR}`
      });
      
      oldR = r; r = newR;
      oldS = s; s = newS;
      oldT = t; t = newT;
    }
    
    return { gcd: oldR, x: oldS, y: oldT, steps };
  };

  const levels = [
    {
      id: 0,
      title: "Foundation: GCD (Greatest Common Divisor)",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Before Bézout's Lemma, we need to understand the <strong>Greatest Common Divisor (GCD)</strong>.</p>
          
          <div className="p-6 border-2 border-blue-300 rounded-lg bg-blue-50">
            <p className="mb-3 text-lg font-semibold">Definition: GCD</p>
            <p>The GCD of integers a and b, written gcd(a, b), is the <strong>largest positive integer</strong> that divides both a and b.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold">Examples:</p>
            <ul className="space-y-2">
              <li>• gcd(12, 18) = 6 (divisors of 12: 1,2,3,4,6,12; of 18: 1,2,3,6,9,18)</li>
              <li>• gcd(15, 28) = 1 (they share only 1 as a divisor - called <strong>coprime</strong>)</li>
              <li>• gcd(24, 36) = 12</li>
            </ul>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">Key Properties:</p>
            <ul className="ml-6 space-y-1 list-disc">
              <li>gcd(a, b) = gcd(b, a) (symmetric)</li>
              <li>gcd(a, 0) = |a| (any number divides 0)</li>
              <li>If gcd(a, b) = 1, we say a and b are <strong>coprime</strong> or <strong>relatively prime</strong></li>
            </ul>
          </div>
        </div>
      ),
      question: "What is gcd(20, 30)?",
      options: [
        { text: "5", correct: false, explanation: "5 divides both, but it's not the largest divisor." },
        { text: "10", correct: true, explanation: "Correct! 10 is the largest number that divides both 20 and 30." },
        { text: "20", correct: false, explanation: "20 doesn't divide 30." },
        { text: "1", correct: false, explanation: "1 divides both, but they have larger common divisors." }
      ],
      hint: "List the divisors of each number and find the largest common one"
    },
    {
      id: 1,
      title: "The Euclidean Algorithm: Computing GCD",
      content: (
        <div className="space-y-4">
          <p className="text-lg">The <strong>Euclidean Algorithm</strong> is an efficient method to compute gcd(a, b).</p>
          
          <div className="p-6 border-2 border-purple-300 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <p className="mb-3 text-lg font-semibold">The Algorithm:</p>
            <ol className="ml-6 space-y-2 list-decimal">
              <li>Divide a by b to get quotient q and remainder r: <strong>a = bq + r</strong></li>
              <li>Replace a with b and b with r</li>
              <li>Repeat until r = 0</li>
              <li>The last non-zero remainder is gcd(a, b)</li>
            </ol>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold">Example: gcd(48, 18)</p>
            <div className="ml-4 space-y-1 font-mono text-sm">
              <p>48 = 18 × 2 + 12</p>
              <p>18 = 12 × 1 + 6</p>
              <p>12 = 6 × 2 + 0</p>
              <p className="font-bold text-green-700">Therefore: gcd(48, 18) = 6</p>
            </div>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Why it works:</p>
            <p className="text-sm text-gray-700">Key insight: gcd(a, b) = gcd(b, r) where r is the remainder when dividing a by b. The common divisors don't change!</p>
          </div>
        </div>
      ),
      question: "In the Euclidean Algorithm for gcd(48, 18), after the first step we have 48 = 18 × 2 + 12. What's the next step?",
      options: [
        { text: "Compute gcd(48, 12)", correct: false, explanation: "No, we replace both numbers. We move to gcd(18, 12)." },
        { text: "Compute gcd(18, 12)", correct: true, explanation: "Correct! We replace a with b (18) and b with r (12)." },
        { text: "Stop, the answer is 12", correct: false, explanation: "We continue until the remainder is 0." },
        { text: "Compute gcd(12, 18)", correct: false, explanation: "Close, but the order matters - it's gcd(18, 12), the old b then the remainder." }
      ],
      hint: "We always move to gcd(old b, remainder)"
    },
    {
      id: 2,
      title: "Interactive: Euclidean Algorithm Practice",
      interactive: true,
      content: (state, setState) => {
        const a = state.a || 84;
        const b = state.b || 30;
        const result = extendedGCD(Math.abs(a), Math.abs(b));

        return (
          <div className="space-y-4">
            <p className="text-lg">Let's compute gcd(a, b) step by step!</p>
            
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="mb-3 font-semibold">Choose your numbers:</p>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block mb-1 text-sm">a:</label>
                  <input
                    type="number"
                    value={a}
                    onChange={(e) => setState({ ...state, a: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">b:</label>
                  <input
                    type="number"
                    value={b}
                    onChange={(e) => setState({ ...state, b: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded"
                  />
                </div>
                <button
                  onClick={() => setState({ a: Math.floor(Math.random() * 90) + 10, b: Math.floor(Math.random() * 90) + 10 })}
                  className="px-4 py-2 mt-5 text-white bg-purple-500 rounded hover:bg-purple-600"
                >
                  Random
                </button>
              </div>
            </div>

            {a > 0 && b > 0 && (
              <div className="p-6 border-2 border-green-300 rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
                <p className="mb-3 text-lg font-semibold">Euclidean Algorithm Steps:</p>
                <div className="space-y-2 font-mono text-sm">
                  {result.steps.slice(1).map((step, idx) => (
                    <p key={idx} className="text-gray-700">{step.equation}</p>
                  ))}
                </div>
                <div className="p-3 mt-4 bg-green-100 rounded">
                  <p className="text-lg font-bold text-green-800">
                    gcd({a}, {b}) = {result.gcd}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      },
      question: "What happens when you compute gcd(a, 0)?",
      options: [
        { text: "It's undefined", correct: false, explanation: "It's well-defined! Every number divides 0." },
        { text: "It equals a", correct: true, explanation: "Correct! gcd(a, 0) = |a| because a is the largest divisor of itself, and everything divides 0." },
        { text: "It equals 0", correct: false, explanation: "0 is not the greatest common divisor." },
        { text: "It equals 1", correct: false, explanation: "Only if a = 1. Generally gcd(a, 0) = |a|." }
      ],
      hint: "Try it in the interactive calculator above!"
    },
    {
      id: 3,
      title: "Bézout's Identity: The Main Theorem",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Now for the star of the show!</p>
          
          <div className="p-6 border-2 border-purple-400 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <p className="mb-3 text-xl font-semibold">Bézout's Lemma (Identity)</p>
            <p className="mb-3">For any integers a and b with gcd(a, b) = d, there exist integers x and y such that:</p>
            <p className="my-4 text-2xl font-bold text-center">ax + by = d</p>
            <p className="text-sm text-gray-700">The coefficients x and y are called <strong>Bézout coefficients</strong>.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Example: gcd(12, 18) = 6</p>
            <p>We can write: <span className="font-mono">12(−1) + 18(1) = 6</span></p>
            <p className="mt-2 text-sm text-gray-600">Check: 12(−1) + 18(1) = −12 + 18 = 6 ✓</p>
            <p className="text-sm text-gray-600">So x = −1, y = 1 are Bézout coefficients.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">Why this is profound:</p>
            <p className="text-sm text-gray-700">The GCD can always be expressed as a <strong>linear combination</strong> of the original numbers! This connects divisibility to linear algebra.</p>
          </div>
        </div>
      ),
      question: "If gcd(15, 25) = 5, which equation represents Bézout's Identity?",
      options: [
        { text: "15x + 25y = 1", correct: false, explanation: "No, the right side should be the GCD, which is 5, not 1." },
        { text: "15x + 25y = 5", correct: true, explanation: "Correct! The GCD (5) equals a linear combination of 15 and 25." },
        { text: "15 × 25 = 5xy", correct: false, explanation: "This is multiplication, not the linear combination form." },
        { text: "x + y = 5", correct: false, explanation: "This doesn't involve our original numbers 15 and 25." }
      ],
      hint: "The right side of Bézout's Identity is always the GCD"
    },
    {
      id: 4,
      title: "Extended Euclidean Algorithm: Finding x and y",
      content: (
        <div className="space-y-4">
          <p className="text-lg">The <strong>Extended Euclidean Algorithm</strong> not only finds the GCD but also computes the Bézout coefficients x and y.</p>
          
          <div className="p-6 border-2 border-blue-300 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
            <p className="mb-3 text-lg font-semibold">The Idea:</p>
            <p>As we run the Euclidean Algorithm, we track how to express each remainder as a combination of a and b.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold">Example: gcd(35, 15)</p>
            <div className="space-y-2 font-mono text-sm">
              <p>35 = 15 × 2 + 5</p>
              <p>15 = 5 × 3 + 0</p>
              <p className="font-bold text-green-700">So gcd = 5</p>
              <p className="mt-3 text-gray-700">Working backwards:</p>
              <p>5 = 35 − 15 × 2</p>
              <p>5 = 35(1) + 15(−2)</p>
              <p className="font-bold text-green-700">Therefore: x = 1, y = −2</p>
            </div>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-purple-50">
            <p className="mb-2 font-semibold">The "Back-Substitution" Method:</p>
            <ol className="ml-6 space-y-1 text-sm list-decimal">
              <li>Run Euclidean Algorithm forward to find GCD</li>
              <li>Express each remainder in terms of previous two</li>
              <li>Work backwards, substituting until you get GCD = ax + by</li>
            </ol>
          </div>
        </div>
      ),
      question: "Given 56 = 21 × 2 + 14, how do we express 14 in terms of 56 and 21?",
      options: [
        { text: "14 = 56 + 21 × 2", correct: false, explanation: "Sign is wrong. We need to isolate 14." },
        { text: "14 = 56 − 21 × 2", correct: true, explanation: "Correct! Rearranging: 14 = 56 − 21 × 2, so 14 = 56(1) + 21(−2)." },
        { text: "14 = 21 × 2 − 56", correct: false, explanation: "This gives −14, not 14." },
        { text: "14 = 56 × 21 ÷ 2", correct: false, explanation: "We need a linear combination (addition/subtraction), not division." }
      ],
      hint: "Rearrange a = bq + r to get r = a − bq"
    },
    {
      id: 5,
      title: "Interactive: Extended Euclidean Algorithm",
      interactive: true,
      content: (state, setState) => {
        const a = state.a2 || 252;
        const b = state.b2 || 105;
        const result = extendedGCD(Math.abs(a), Math.abs(b));

        return (
          <div className="space-y-4">
            <p className="text-lg">Watch the Extended Euclidean Algorithm find both GCD and Bézout coefficients!</p>
            
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="mb-3 font-semibold">Choose your numbers:</p>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block mb-1 text-sm">a:</label>
                  <input
                    type="number"
                    value={a}
                    onChange={(e) => setState({ ...state, a2: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">b:</label>
                  <input
                    type="number"
                    value={b}
                    onChange={(e) => setState({ ...state, b2: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded"
                  />
                </div>
                <button
                  onClick={() => setState({ ...state, a2: Math.floor(Math.random() * 200) + 50, b2: Math.floor(Math.random() * 100) + 20 })}
                  className="px-4 py-2 mt-5 text-white bg-purple-500 rounded hover:bg-purple-600"
                >
                  Random
                </button>
              </div>
            </div>

            {a > 0 && b > 0 && (
              <>
                <div className="p-6 border-2 border-green-300 rounded-lg bg-green-50">
                  <p className="mb-3 text-lg font-semibold">Algorithm Steps:</p>
                  <div className="space-y-1 font-mono text-sm">
                    {result.steps.slice(1).map((step, idx) => (
                      <p key={idx} className="text-gray-700">{step.equation}</p>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-2 border-purple-400 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <p className="mb-3 text-xl font-semibold">Bézout's Identity:</p>
                  <div className="space-y-2 text-center">
                    <p className="text-2xl font-bold text-purple-700">
                      {a}({result.x}) + {b}({result.y}) = {result.gcd}
                    </p>
                    <p className="text-sm text-gray-600">Verification: {a * result.x} + {b * result.y} = {result.gcd} ✓</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                    <div className="p-3 bg-white rounded">
                      <p className="text-sm text-gray-600">x coefficient</p>
                      <p className="text-xl font-bold">{result.x}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-sm text-gray-600">y coefficient</p>
                      <p className="text-xl font-bold">{result.y}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-sm text-gray-600">GCD</p>
                      <p className="text-xl font-bold">{result.gcd}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      },
      question: "What do the Bézout coefficients tell us?",
      options: [
        { text: "How many times each number divides the other", correct: false, explanation: "No, they tell us how to combine the numbers to get the GCD." },
        { text: "The weights to combine a and b to get their GCD", correct: true, explanation: "Exactly! They tell us ax + by = gcd(a,b) - a linear combination." },
        { text: "The prime factorization of the GCD", correct: false, explanation: "The coefficients are about linear combinations, not factorization." },
        { text: "Whether the numbers are coprime", correct: false, explanation: "The GCD itself tells us that (gcd = 1 means coprime), not the coefficients." }
      ],
      hint: "Think about what the equation ax + by = d represents"
    },
    {
      id: 6,
      title: "Corollary 1: Coprime Numbers",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Bézout's Lemma has powerful consequences!</p>
          
          <div className="p-6 border-2 border-green-400 rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
            <p className="mb-3 text-xl font-semibold">Corollary: Coprime Characterization</p>
            <p className="mb-3">Integers a and b are coprime (gcd(a,b) = 1) if and only if there exist integers x, y such that:</p>
            <p className="my-4 text-2xl font-bold text-center">ax + by = 1</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Example: Are 8 and 15 coprime?</p>
            <p>We can find: 8(−7) + 15(4) = −56 + 60 = 4... no, that's not 1.</p>
            <p>But: 8(2) + 15(−1) = 16 − 15 = 1 ✓</p>
            <p className="mt-2 font-semibold text-green-700">Since we can write 1 as a combination, they ARE coprime!</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">Why this matters:</p>
            <p className="text-sm text-gray-700">This gives us a <strong>constructive</strong> way to prove two numbers are coprime - just find coefficients that work! It's also the foundation for modular arithmetic and cryptography.</p>
          </div>
        </div>
      ),
      question: "If we can write 17x + 13y = 1 for some integers x, y, what can we conclude?",
      options: [
        { text: "17 and 13 are both prime", correct: false, explanation: "While they happen to be prime, this equation tells us about their GCD, not primality." },
        { text: "17 and 13 are coprime", correct: true, explanation: "Correct! If ax + by = 1, then gcd(a,b) = 1, so they're coprime." },
        { text: "17 divides 13", correct: false, explanation: "No, 17 doesn't divide 13. The equation shows they're coprime." },
        { text: "x and y must both be 1", correct: false, explanation: "No, x and y can be any integers that make the equation work." }
      ],
      hint: "What's the GCD if we can write ax + by = 1?"
    },
    {
      id: 7,
      title: "Corollary 2: Euclid's Lemma",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Here's another powerful consequence:</p>
          
          <div className="p-6 border-2 border-purple-400 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50">
            <p className="mb-3 text-xl font-semibold">Euclid's Lemma</p>
            <p className="mb-3">If a prime p divides a product ab, then:</p>
            <p className="my-3 text-xl font-bold text-center">p divides a OR p divides b (or both)</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Example:</p>
            <p>Suppose 7 divides 14 × 15 = 210.</p>
            <p className="mt-2">Does 7 divide 14? <span className="font-bold text-green-700">Yes! (14 = 7 × 2)</span></p>
            <p>So the lemma holds.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold">Proof sketch using Bézout:</p>
            <ol className="ml-6 space-y-2 text-sm list-decimal">
              <li>Assume p divides ab but p doesn't divide a</li>
              <li>Since p is prime and doesn't divide a: gcd(p, a) = 1</li>
              <li>By Bézout: px + ay = 1 for some x, y</li>
              <li>Multiply by b: pbx + aby = b</li>
              <li>Since p|ab, we have p|aby; and clearly p|pbx</li>
              <li>So p divides the right side: p|b ✓</li>
            </ol>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">Why it matters:</p>
            <p className="text-sm text-gray-700">This is the foundation of unique prime factorization! It's what makes primes "prime" - they can't be "fooled" by products.</p>
          </div>
        </div>
      ),
      question: "If 11 divides 6 × n, what must be true?",
      options: [
        { text: "11 must divide 6", correct: false, explanation: "11 doesn't divide 6. By Euclid's Lemma, 11 must divide n." },
        { text: "11 must divide n", correct: true, explanation: "Correct! Since 11 is prime and doesn't divide 6, it must divide n." },
        { text: "n must equal 11", correct: false, explanation: "n could be any multiple of 11, not just 11 itself." },
        { text: "6 must divide 11", correct: false, explanation: "This is backwards and false." }
      ],
      hint: "11 is prime and doesn't divide 6, so..."
    },
    {
      id: 8,
      title: "Application: Linear Diophantine Equations",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Bézout's Lemma solves a whole class of equations!</p>
          
          <div className="p-6 border-2 border-pink-400 rounded-lg bg-gradient-to-r from-pink-50 to-red-50">
            <p className="mb-3 text-xl font-semibold">Linear Diophantine Equations</p>
            <p className="mb-2">An equation of the form <span className="font-mono text-lg">ax + by = c</span> where we want integer solutions.</p>
            <p className="mt-3 font-semibold">Theorem:</p>
            <p>ax + by = c has integer solutions if and only if gcd(a, b) divides c.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Example: 6x + 9y = 15</p>
            <p className="space-y-1 text-sm">
              <span className="block">• gcd(6, 9) = 3</span>
              <span className="block">• Does 3 divide 15? Yes! (15 = 3 × 5)</span>
              <span className="block">• So solutions exist!</span>
            </p>
            <p className="mt-2 text-sm">We can divide through by 3: 2x + 3y = 5</p>
            <p className="text-sm">Using Extended Euclidean: 2(−1) + 3(1) = 1</p>
            <p className="text-sm">Multiply by 5: 2(−5) + 3(5) = 5</p>
            <p className="mt-2 font-bold text-green-700">Solution: x = −5, y = 5</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold">Counter-example: 6x + 9y = 10</p>
            <p className="space-y-1 text-sm">
              <span className="block">• gcd(6, 9) = 3</span>
              <span className="block">• Does 3 divide 10? No! (10 = 3 × 3 + 1)</span>
              <span className="block font-bold text-red-700">• So NO integer solutions exist!</span>
            </p>
          </div>
        </div>
      ),
      question: "Does the equation 12x + 18y = 7 have integer solutions?",
      options: [
        { text: "Yes, because 12 and 18 are both even", correct: false, explanation: "Being even doesn't determine solvability. We need to check if gcd(12,18) divides 7." },
        { text: "No, because gcd(12, 18) = 6 doesn't divide 7", correct: true, explanation: "Correct! Since 6 doesn't divide 7, no integer solutions exist." },
        { text: "Yes, with x = 1, y = 0", correct: false, explanation: "Check: 12(1) + 18(0) = 12 ≠ 7. This doesn't work." },
        { text: "We can't tell without solving it", correct: false, explanation: "We CAN tell! Just check if gcd(a,b) divides c." }
      ],
      hint: "First find gcd(12, 18), then check if it divides 7"
    },
    {
      id: 9,
      title: "Application: Modular Inverses",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Bézout's Lemma is crucial in modular arithmetic!</p>
          
          <div className="p-6 border-2 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-400">
            <p className="mb-3 text-xl font-semibold">Modular Inverse</p>
            <p className="mb-2">We say a has a <strong>multiplicative inverse modulo m</strong> if there exists b such that:</p>
            <p className="my-3 text-xl font-bold text-center">ab ≡ 1 (mod m)</p>
            <p className="text-sm text-gray-700">Meaning: ab leaves remainder 1 when divided by m</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-purple-50">
            <p className="mb-2 font-semibold">Theorem (using Bézout):</p>
            <p>a has an inverse mod m if and only if gcd(a, m) = 1</p>
            <p className="mt-2 text-sm text-gray-700"><strong>Proof:</strong> If gcd(a,m) = 1, then by Bézout: ax + my = 1. This means ax ≡ 1 (mod m), so x is the inverse!</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold">Example: Find inverse of 7 mod 26</p>
            <div className="space-y-1 text-sm">
              <p>• gcd(7, 26) = 1 ✓ (so inverse exists)</p>
              <p>• Extended Euclidean gives: 7(−11) + 26(3) = 1</p>
              <p>• So 7(−11) ≡ 1 (mod 26)</p>
              <p>• Convert to positive: −11 ≡ 15 (mod 26)</p>
              <p className="font-bold text-green-700">• The inverse of 7 mod 26 is 15</p>
              <p className="text-gray-600">• Check: 7 × 15 = 105 = 26 × 4 + 1 ✓</p>
            </div>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">Real-world use:</p>
            <p className="text-sm text-gray-700">This is the foundation of RSA encryption! Finding modular inverses quickly is essential for secure communication.</p>
          </div>
        </div>
      ),
      question: "Can 6 have a multiplicative inverse mod 15?",
      options: [
        { text: "Yes, because 6 < 15", correct: false, explanation: "Size doesn't matter. We need gcd(6, 15) = 1." },
        { text: "No, because gcd(6, 15) = 3 ≠ 1", correct: true, explanation: "Correct! Since they share a common factor (3), no inverse exists." },
        { text: "Yes, the inverse is 9", correct: false, explanation: "Check: 6 × 9 = 54 = 15 × 3 + 9 ≡ 9 (mod 15), not 1." },
        { text: "Yes, using Bézout's Lemma", correct: false, explanation: "Bézout tells us an inverse exists only if gcd = 1. Here gcd = 3." }
      ],
      hint: "Check gcd(6, 15) first!"
    },
    {
      id: 10,
      title: "Related: The Chinese Remainder Theorem",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Another beautiful theorem related to Bézout!</p>
          
          <div className="p-6 border-2 border-orange-400 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50">
            <p className="mb-3 text-xl font-semibold">Chinese Remainder Theorem (CRT)</p>
            <p className="mb-3">If m₁, m₂, ..., mₖ are pairwise coprime (gcd(mᵢ, mⱼ) = 1 for i ≠ j), then the system:</p>
            <div className="my-3 space-y-1 text-center">
              <p>x ≡ a₁ (mod m₁)</p>
              <p>x ≡ a₂ (mod m₂)</p>
              <p>...</p>
              <p>x ≡ aₖ (mod mₖ)</p>
            </div>
            <p>has a unique solution modulo M = m₁ × m₂ × ... × mₖ</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Example: Solve</p>
            <div className="ml-4 space-y-1">
              <p>x ≡ 2 (mod 3)</p>
              <p>x ≡ 3 (mod 5)</p>
            </div>
            <p className="mt-2 text-sm">Since gcd(3,5) = 1, a unique solution exists mod 15.</p>
            <p className="text-sm">Answer: x ≡ 8 (mod 15)</p>
            <p className="text-sm text-gray-600">Check: 8 = 3(2) + 2 ✓ and 8 = 5(1) + 3 ✓</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold">Connection to Bézout:</p>
            <p className="text-sm text-gray-700">The proof of CRT uses Bézout's Lemma! Since the moduli are coprime, we can use Bézout coefficients to construct the solution.</p>
          </div>
        </div>
      ),
      question: "Why does the Chinese Remainder Theorem require coprime moduli?",
      options: [
        { text: "To make the calculation easier", correct: false, explanation: "It's not about ease - it's mathematically necessary for uniqueness." },
        { text: "Because Bézout's Lemma requires gcd = 1 to guarantee solutions", correct: true, explanation: "Exactly! The proof uses Bézout coefficients, which exist because the moduli are coprime." },
        { text: "It doesn't - any moduli work", correct: false, explanation: "False! If moduli aren't coprime, multiple solutions or no solutions may exist." },
        { text: "To ensure the system has no solution", correct: false, explanation: "Opposite! Coprimality ensures a unique solution exists." }
      ],
      hint: "Think about what Bézout's Lemma requires"
    },
    {
      id: 11,
      title: "Master Challenge: Proving Bézout's Lemma",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">Let's understand the proof of Bézout's Lemma</p>
          
          <div className="p-6 border-2 border-purple-400 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <p className="mb-3 text-lg font-semibold">Proof Outline:</p>
            <ol className="ml-6 space-y-3 text-sm list-decimal">
              <li>Consider the set S = &#123;ax + by : x, y ∈ ℤ and ax + by &gt; 0&#125;</li>
              <li>S is non-empty (e.g., a·|a| + b·0 = |a|² &gt; 0)</li>
              <li>By the Well-Ordering Principle, S has a smallest element d = ax₀ + by₀</li>
              <li>We claim d = gcd(a, b). We need to show:
                <ul className="mt-1 ml-6 list-disc">
                  <li>d divides both a and b</li>
                  <li>d is the greatest such divisor</li>
                </ul>
              </li>
              <li>By division algorithm: a = qd + r where 0 ≤ r &lt; d </li>
              <li>Then r = a - qd = a - q(ax₀ + by₀) = a(1-qx₀) + b(-qy₀)</li>
              <li>If r &gt; 0, then r ∈ S but r &lt; d, contradicting minimality of d</li>
              <li>So r = 0, meaning d divides a. Similarly, d divides b</li>
              <li>If c divides both a and b, then c divides ax₀ + by₀ = d</li>
              <li>Therefore d is the greatest common divisor ∎</li>
            </ol>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Key Insights:</p>
            <ul className="ml-6 space-y-1 text-sm list-disc">
              <li>The GCD is the <strong>smallest positive</strong> linear combination</li>
              <li>Every linear combination is a multiple of the GCD</li>
              <li>The proof is non-constructive (doesn't tell us how to find x₀, y₀)</li>
            </ul>
          </div>
        </div>
      ),
      question: "What principle ensures that S has a smallest element?",
      options: [
        { text: "The Fundamental Theorem of Arithmetic", correct: false, explanation: "That's about prime factorization, not minimal elements." },
        { text: "The Well-Ordering Principle", correct: true, explanation: "Correct! Every non-empty set of positive integers has a smallest element." },
        { text: "Bézout's Lemma itself", correct: false, explanation: "We're proving Bézout's Lemma - we can't use it in its own proof!" },
        { text: "The Euclidean Algorithm", correct: false, explanation: "The algorithm computes the GCD, but the proof uses Well-Ordering." }
      ],
      hint: "What property of positive integers guarantees a minimum exists?"
    },
    {
      id: 12,
      title: "Summary and Mastery",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">You've mastered Bézout's Lemma and its ecosystem!</p>
          
          <div className="p-6 border-2 border-green-400 rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
            <p className="mb-3 text-xl font-semibold">What You've Learned:</p>
            <div className="space-y-3 text-sm">
              <div className="pl-3 border-l-4 border-green-500">
                <p className="font-semibold">Bézout's Lemma</p>
                <p>For gcd(a,b) = d, there exist x, y such that ax + by = d</p>
              </div>
              <div className="pl-3 border-l-4 border-blue-500">
                <p className="font-semibold">Extended Euclidean Algorithm</p>
                <p>Computes both GCD and Bézout coefficients efficiently</p>
              </div>
              <div className="pl-3 border-l-4 border-purple-500">
                <p className="font-semibold">Euclid's Lemma</p>
                <p>If prime p divides ab, then p divides a or b</p>
              </div>
              <div className="pl-3 border-l-4 border-pink-500">
                <p className="font-semibold">Linear Diophantine Equations</p>
                <p>ax + by = c solvable iff gcd(a,b) divides c</p>
              </div>
              <div className="pl-3 border-l-4 border-orange-500">
                <p className="font-semibold">Modular Inverses</p>
                <p>a has inverse mod m iff gcd(a,m) = 1</p>
              </div>
              <div className="pl-3 border-l-4 border-yellow-500">
                <p className="font-semibold">Chinese Remainder Theorem</p>
                <p>System of congruences with coprime moduli has unique solution</p>
              </div>
            </div>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="flex items-center gap-2 mb-2 font-semibold">
              <Sparkles className="w-5 h-5" />
              Applications in the Real World:
            </p>
            <ul className="ml-6 space-y-1 text-sm list-disc">
              <li><strong>Cryptography:</strong> RSA encryption uses modular inverses</li>
              <li><strong>Computer Science:</strong> Hash functions and distributed systems</li>
              <li><strong>Engineering:</strong> Signal processing and error correction</li>
              <li><strong>Pure Math:</strong> Foundation for algebraic number theory</li>
            </ul>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">The Big Picture:</p>
            <p className="text-sm text-gray-700">Bézout's Lemma connects three fundamental concepts: divisibility (GCD), linear algebra (linear combinations), and modular arithmetic. It's a bridge between different areas of mathematics!</p>
          </div>
        </div>
      ),
      question: "What's the most important takeaway from Bézout's Lemma?",
      options: [
        { text: "It gives us a fast algorithm to compute GCD", correct: false, explanation: "That's the Euclidean Algorithm. Bézout tells us something deeper." },
        { text: "The GCD can always be expressed as a linear combination", correct: true, explanation: "Perfect! This profound connection between divisibility and linear combinations is the heart of Bézout's Lemma." },
        { text: "All numbers have modular inverses", correct: false, explanation: "Only coprime numbers do. Bézout explains when inverses exist." },
        { text: "Prime numbers are special", correct: false, explanation: "True, but that's more about Euclid's Lemma. Bézout is about all integers." }
      ],
      hint: "What does ax + by = d tell us about the relationship between operations?"
    }
  ];

  const handleAnswer = (levelId, optionIndex) => {
    const level = levels[levelId];
    
    if (level.multiSelect) {
      const current = userAnswers[levelId] || [];
      const newAnswers = current.includes(optionIndex)
        ? current.filter(i => i !== optionIndex)
        : [...current, optionIndex];
      setUserAnswers({ ...userAnswers, [levelId]: newAnswers });
    } else {
      setUserAnswers({ ...userAnswers, [levelId]: [optionIndex] });
    }
  };

  const checkAnswer = (levelId) => {
    const level = levels[levelId];
    const selected = userAnswers[levelId] || [];
    const correctIndices = level.options
      .map((opt, idx) => opt.correct ? idx : -1)
      .filter(idx => idx !== -1);
    
    const isCorrect = selected.length === correctIndices.length &&
      selected.every(idx => correctIndices.includes(idx));
    
    if (isCorrect && !completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId]);
    }
    
    return isCorrect;
  };

  const currentLevelData = levels[currentLevel];
  const selected = userAnswers[currentLevel] || [];
  const hasAnswered = selected.length > 0;
  const isCorrect = hasAnswered && checkAnswer(currentLevel);
  const canProceed = completedLevels.includes(currentLevel) || isCorrect;

  return (
    <div className="max-w-4xl min-h-screen p-6 mx-auto bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Master Bézout's Lemma
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 transition-all duration-500 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${((currentLevel + 1) / levels.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600">
              {currentLevel + 1}/{levels.length}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-purple-600">
              LEVEL {currentLevel + 1}
            </span>
            {completedLevels.includes(currentLevel) && (
              <Award className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {currentLevelData.title}
          </h2>
          
          <div className="mb-6 prose max-w-none">
            {currentLevelData.interactive ? 
              currentLevelData.content(interactiveState, setInteractiveState) : 
              currentLevelData.content
            }
          </div>
        </div>

        <div className="p-6 mb-6 rounded-lg bg-gray-50">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            {currentLevelData.question}
          </h3>
          
          <div className="space-y-3">
            {currentLevelData.options.map((option, idx) => {
              const isSelected = selected.includes(idx);
              const showResult = hasAnswered;
              
              return (
                <div key={idx}>
                  <button
                    onClick={() => handleAnswer(currentLevel, idx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? showResult && option.correct
                          ? 'border-green-500 bg-green-50'
                          : showResult && !option.correct
                          ? 'border-red-500 bg-red-50'
                          : 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.text}</span>
                      {showResult && isSelected && (
                        option.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )
                      )}
                    </div>
                  </button>
                  {showResult && isSelected && (
                    <p className={`mt-2 text-sm ml-4 ${
                      option.correct ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {option.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {currentLevelData.hint && (
            <div className="mt-4">
              <button
                onClick={() => setShowHints({ ...showHints, [currentLevel]: !showHints[currentLevel] })}
                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {showHints[currentLevel] ? 'Hide' : 'Show'} Hint
                </span>
              </button>
              {showHints[currentLevel] && (
                <p className="p-3 mt-2 text-sm text-gray-600 rounded bg-yellow-50">
                  {currentLevelData.hint}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentLevel(Math.max(0, currentLevel - 1))}
            disabled={currentLevel === 0}
            className="px-6 py-2 text-gray-700 transition-colors bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
          >
            Previous
          </button>
          
          {currentLevel === levels.length - 1 ? (
            <div className="flex items-center gap-2">
              {completedLevels.length === levels.length && (
                <div className="flex items-center gap-2 font-semibold text-green-600">
                  <Award className="w-6 h-6" />
                  <span>Master Complete!</span>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setCurrentLevel(Math.min(levels.length - 1, currentLevel + 1))}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {completedLevels.length === levels.length && (
          <div className="p-6 mt-6 border-2 border-green-300 rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="flex items-center gap-2 mb-2 text-xl font-bold text-gray-800">
              <Award className="w-6 h-6 text-yellow-500" />
              Congratulations, Bézout Master!
            </h3>
            <p className="mb-3 text-gray-700">
              You've mastered Bézout's Lemma and its related theorems. You now understand:
            </p>
            <ul className="ml-6 space-y-1 text-gray-700 list-disc">
              <li>How to compute GCD with the Euclidean Algorithm</li>
              <li>How to find Bézout coefficients with the Extended Euclidean Algorithm</li>
              <li>When linear Diophantine equations have solutions</li>
              <li>How to find modular inverses</li>
              <li>The foundations of modern cryptography</li>
            </ul>
            <p className="mt-4 italic text-gray-700">
              This ancient mathematics powers our modern digital world!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BezoutLemma;