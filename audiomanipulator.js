(() => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();

  function bitcrush(node, bits = 4, rate = 8000) {
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    let phase = 0;
    let last = 0;
    const step = Math.pow(0.5, bits);

    processor.onaudioprocess = e => {
      const input = e.inputBuffer.getChannelData(0);
      const output = e.outputBuffer.getChannelData(0);

      for (let i = 0; i < input.length; i++) {
        phase += rate / ctx.sampleRate;
        if (phase >= 1) {
          phase -= 1;
          last = step * Math.floor(input[i] / step + 0.5);
        }
        output[i] = last;
      }
    };

    node.connect(processor);
    processor.connect(ctx.destination);
  }

  function hook(el) {
    if (el._manipulated) return;
    const src = ctx.createMediaElementSource(el);
    bitcrush(src);
    el._manipulated = true;
  }

  document.querySelectorAll('audio, video').forEach(hook);

  new MutationObserver(m => {
    m.forEach(r => r.addedNodes.forEach(n => {
      if (n.tagName === 'AUDIO' || n.tagName === 'VIDEO') hook(n);
    }));
  }).observe(document.body, { childList: true, subtree: true });
})();
