export function getCoords(origin) {
  var result = []
  
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      const trueCoords = {x: i + 4, y: j + 4}
      const vx = origin.x + i;
      const vy = origin.y + j;
      const virtualCoords = (vx < 0 || vy < 0) ? null : {x: vx, y: vy};
      result.push({trueCoords: trueCoords, virtualCoords: virtualCoords});
    }
  }

  return result;
}

export function getId(coords) {
  return `${coords.virtualCoords.x}-${coords.virtualCoords.y}`;
}

export function initScrollController(grid) {
  const blocks = Array.from(document.querySelectorAll('.block'));
  const colors = ["#2a9d8f", "#e76f51", "#264653", "#f4a261", "#e9c46a"];

  // Logical position in infinite grid
  let offsetX = 0;
  let offsetY = 0;

  // window.addEventListener('resize', resetScroll);
  viewport.addEventListener('scroll', () => {
    clearTimeout(viewport._scrollTimeout);
    viewport._scrollTimeout = setTimeout(handleScroll(viewport), 80); // debounce
  });

  // Initialize
  // updateBlocks();
  // resetScroll();
}


function updateBlocks() {
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const index = y * 3 + x;
      const block = blocks[index];
      const vx = offsetX + x - 1;
      const vy = offsetY + y - 1;
      block.textContent = `(${vx}, ${vy})`;
      block.style.background = colors[Math.abs(vx + vy) % colors.length];
    }
  }
}

export function resetScroll(container) {
  container.scrollLeft = container.offsetWidth;
  container.scrollTop = container.offsetWidth;
}

export function handleScroll(container, offset) { return () => {
  const col = Math.round(container.scrollLeft / window.innerWidth);
  const row = Math.round(container.scrollTop / window.innerHeight);

  let changed = false;

  if (col === 0) {
    offset.current.x--;
    changed = true;
  } else if (col === 2) {
    offset.current.x++;
    changed = true;
  }

  if (row === 0) {
    offset.current.y--;
    changed = true;
  } else if (row === 2) {
    offset.current.y++;
    changed = true;
  }

  if (changed) {
    console.log(offset.current.x);
    // updateBlocks();
    // resetScroll();
  }
}}

