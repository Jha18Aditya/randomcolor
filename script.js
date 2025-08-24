// DOM Elements
const btn = document.querySelector(".colorbt");
const formatSelect = document.getElementById("colorFormat");
const paletteType = document.getElementById("paletteType");
const primaryColor = document.querySelector(".primary");
const paletteColors = document.querySelector(".palette-colors");
const rgbValue = document.getElementById("rgbValue");
const hexValue = document.getElementById("hexValue");
const secondaryColor = document.querySelector('.secondary');
const tertiaryColor = document.querySelector('.tertiary');

// Utilities
const rgbToHex = (r, g, b) =>
  '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

const getRandomColor = () => ({
  red: Math.floor(Math.random() * 255),
  green: Math.floor(Math.random() * 255),
  blue: Math.floor(Math.random() * 255)
});

const getComplementaryColor = ({ red, green, blue }) => ({
  red: 255 - red,
  green: 255 - green,
  blue: 255 - blue
});

const getTriadicColors = ({ red, green, blue }) => [
  { red, green, blue },
  { red: green, green: blue, blue: red },
  { red: blue, green: red, blue: green }
];

const updateColorElement = (element, { red, green, blue }, format) => {
  const rgbString = `rgb(${red}, ${green}, ${blue})`;
  const hexString = rgbToHex(red, green, blue);

  element.style.backgroundColor = rgbString;
  element.querySelector('.color-code').textContent =
    format === 'hex' ? hexString : rgbString;
};

// Main palette generator
const generatePalette = () => {
  const format = formatSelect.value;
  const type = paletteType.value;
  const baseColor = getRandomColor();

  // Always update primary color
  updateColorElement(primaryColor, baseColor, format);
  rgbValue.textContent = `rgb(${baseColor.red}, ${baseColor.green}, ${baseColor.blue})`;
  hexValue.textContent = rgbToHex(baseColor.red, baseColor.green, baseColor.blue);

  // Reset visibility
  paletteColors.classList.remove('hidden');
  secondaryColor.style.display = 'none';
  tertiaryColor.style.display = 'none';

  if (type === 'single') {
    // Only show primary
    paletteColors.classList.add('hidden');
  }

  if (type === 'complementary') {
    const comp = getComplementaryColor(baseColor);
    updateColorElement(secondaryColor, comp, format);
    secondaryColor.style.display = 'flex';
  }

  if (type === 'triadic') {
    const triadic = getTriadicColors(baseColor);
    updateColorElement(secondaryColor, triadic[1], format);
    updateColorElement(tertiaryColor, triadic[2], format);
    secondaryColor.style.display = 'flex';
    tertiaryColor.style.display = 'flex';
  }
};


// Copy color value
document.querySelectorAll('.action-btn').forEach(btn => {
  if (btn.title === "Copy Color") {
    btn.addEventListener('click', (e) => {
      const colorCode = e.target.closest('.color').querySelector('.color-code').textContent;
      navigator.clipboard.writeText(colorCode).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1000);
      });
    });
  }
});

// Event Listeners
btn.addEventListener("click", generatePalette);
formatSelect.addEventListener("change", generatePalette);
paletteType.addEventListener("change", generatePalette);

// Initial render
generatePalette();
