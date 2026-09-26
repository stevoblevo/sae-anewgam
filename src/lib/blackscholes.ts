function pdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/** Black–Scholes gamma. Spot S, strike K, time in years, rate, vol. Peaks at the strike. */
export function bsGamma(S: number, K: number, t: number, r: number, sigma: number): number {
  if (S <= 0 || K <= 0 || t <= 0 || sigma <= 0) return 0;
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * t) / (sigma * Math.sqrt(t));
  return pdf(d1) / (S * sigma * Math.sqrt(t));
}
