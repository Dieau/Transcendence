<template>
  <div class="background-scene">
    <div class="top">
      <div class="top-lines" />
      <div class="brand">
        <div class=".triangle" />
        <div class=".kode-text" />
      </div>
      <div class="sun" />
    </div>
    <div class="bottom">
      <div class="m0" />
      <div class="m1" />
      <div class="m2" />
      <div class="bottom-overlay" />
    </div>
    <section class="shooting-stars">
      <span></span>
      <span></span>
      <span></span>
    </section>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@property --shift {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}

$--labs-sys-color-background: #111;
$--labs-sys-color-on-background: white;
$--base-speed: 4s;

$--labs-sys-color-grid: #fac4ff;
$--labs-sys-color-grid-glow: #df7373;
$--labs-sys-color-sun-1: #fdb428;
$--labs-sys-color-sun-2: #f672ca;
$--labs-sys-color-sun-glow: #b9f;

$--labs-sys-color-star: #f6c0c0;

$--color-palm-trunk: #333;
$--color-palm-leaf: #333;
$--color-palm-leaf-2: #b9f;
$--labs-sys-color-triangle: #6eccee;

$--labs-sys-color-volume: $--labs-sys-color-triangle;

@mixin sun-lines {
  $lines: "";
  $end: 0;
  $lineCount: 8;
  @for $i from 1 to $lineCount {$start: $i + $end;
    $end: $start + $lineCount - $i;
    $lines: $lines + " #000 calc(#{$start}% + (3.5% * var(--shift))), 0%, #0000 calc(#{$end}%  + (2.8% * var(--shift))), 0%,";
  }
  $lines: $lines + "#000 calc(56% + (2.5% * var(--shift)))";
  --shift: 1;
  mask: linear-gradient(to top, #{$lines});
  mask-size: 100% 120%;
  -webkit-mask-size: 100% 120%;
  animation: sun 4s linear infinite;
}

.sun {
  position:absolute;
  display: table;
  z-index: 0;
  text-align:center;
  top: 26%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(40vmin, 40%);
  aspect-ratio: 1;
  border-radius: 50%;
  &:after {
    content: "";
    position: absolute;
    inset: 0;
    @include sun-lines;
    border-radius: inherit;
    background-image: linear-gradient(to bottom, $--labs-sys-color-sun-1, $--labs-sys-color-sun-2 60%);
  }
  &:before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.6;
    background-image: linear-gradient(
      to top,
      $--labs-sys-color-sun-1,
      $--labs-sys-color-sun-2 55%,
      $--labs-sys-color-triangle 65%,
      $--labs-sys-color-sun-2 69%
    );
    border-radius: inherit;
    transform: translateY(170%) rotateX(40deg) scaleY(1);
    perspective: 6.25rem;
    filter: blur(20px);
  }
  filter: drop-shadow(0 0 4rem $--labs-sys-color-sun-glow);
}

.top-lines {
  background: linear-gradient(
    to bottom,
    $--labs-sys-color-sun-2 0.2vmin,
    transparent 0.2vmin
  );
  background-size: 125rem 0.4vmin;
  position: absolute;
  inset: 0;
  mix-blend-mode: overlay;
  opacity: 0.06;
  pointer-events: none;
}

.top {
  z-index: 1;
  padding-top: 4rem;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  position: relative;

  // 🏔️
  &:after {
    content: "";
    position: absolute;
    bottom: -0.5vmin;
    left: 0;
    right: 0;
    background: #222;
    height: 5vmin;
    clip-path: polygon(
      0% 38%,
      2.6% 40%,
      5.4% 24%,
      8.7% 59%,
      13.6% 72%,
      18.5% 22%,
      21.7% 35%,
      27.2% 8%,
      34% 53%,
      39.4% 81%,
      49.1% 85%,
      54.5% 64%,
      60% 53%,
      71.4% 80%,
      73.4% 15%,
      79.8% 29%,
      86.5% 15%,
      94.1% 36%,
      100% 27%,
      100% 100%,
      0% 100%
    );
  }
  // 🏔️
  &:before {
    content: "";
    position: absolute;
    bottom: -1vmin;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    mix-blend-mode: soft-light;
    height: 15vmin;
    backdrop-filter: blur(20px);
    clip-path: polygon(
      0% 38%,
      2.6% 40%,
      5.4% 24%,
      8.7% 59%,
      13.6% 72%,
      18.5% 22%,
      21.7% 35%,
      27.2% 8%,
      34% 53%,
      39.4% 81%,
      49.1% 85%,
      54.5% 64%,
      60% 53%,
      71.2% 70%,
      76.6% 24%,
      81.4% 0%,
      87.1% 13%,
      94.2% 27%,
      100% 32%,
      100% 100%,
      0% 100%
    );
  }
}

.bottom-overlay {
  perspective: 14.5rem;
  flex: 0 0 12.5rem;
  position: absolute;
  z-index: 10000;
  right: 0;
  left: 0;
  bottom: 0;
  height: 12.5rem;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(30, 30, 30, 0.9) 70%
  );
}

// 🏁
.bottom {
  background: inherit;
  perspective: 14.5rem;
  flex: 0 0 12.5rem;
  position: relative;

  // grid
  &:before {
    content: "";
    position: absolute;
    inset: 0;
    $--line-width: 0.0635rem;
    background: linear-gradient(
        to right,
        $--labs-sys-color-grid $--line-width,
        transparent $--line-width
      ),
      linear-gradient(
        to bottom,
        $--labs-sys-color-grid $--line-width,
        transparent $--line-width
      );
    background-size: 2rem 125rem, 125rem 2rem;
    transform: rotateX(53deg) scale(1.8) translateZ(43px);
    animation: grid calc($--base-speed * 1) linear infinite;
    border-top: 1px solid $--labs-sys-color-grid;
    filter: drop-shadow(0 0 2px $--labs-sys-color-grid-glow);
  }
}

// 🌎
.background-scene {
  position: fixed;
  background-color: $--labs-sys-color-background;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: url(https://assets.codepen.io/907471/noise.svg);
    opacity: 0.7;
    mix-blend-mode: overlay;
    filter: invert(1);
    z-index: 20000;
  }
}

body {
  background-color: $--labs-sys-color-background;
  color: $--labs-sys-color-on-background;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: $--labs-sys-color-triangle;
}

.shooting-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background-color: black;
  background-position-x: center;
  background-size: cover;
  animation: animateBg 50s linear infinite;
  overflow: hidden;
}

@keyframes animateBg {
  0%, 100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

.shooting-stars span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1),
    0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 1);
  animation: animate 5s linear infinite;
}

.shooting-stars span::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 1px;
  background: linear-gradient(90deg, #fff, transparent);
}

@keyframes animate {
  0% {
    transform: rotate(345deg) translateX(0);
    opacity: 1;
  }

  70% {
    opacity: 1;
  }

  100% {
    transform: rotate(345deg) translateX(-1500px);
    opacity: 0;
  }
}

.shooting-stars span:nth-child(1) {
  top: 0;
  right: 0;
  left: initial;
  animation-delay: 0;
  animation-duration: 3s;
}

.shooting-stars span:nth-child(2) {
  top: 0;
  right: 600px;
  left: initial;
  animation-delay: 1.5s;
  animation-duration: 3s;
}

.shooting-stars span:nth-child(3) {
  top: 0;
  right: 180px;
  left: initial;
  animation-delay: 4s;
  animation-duration: 1.5s;
}

</style>
