import React from "react";

type ColorSwatchProps = {
  label: string;
  varName: string;
};

const ColorSwatch = ({ label, varName }: ColorSwatchProps) => (
  <div className="flex flex-col items-center mx-4 my-4">
    <div className="text-sm mb-1">{varName}</div>
    <div
      className="w-16 h-16 rounded-full border border-gray-300"
      style={{ backgroundColor: `var(--${label})` }}
    ></div>
    <div className="text-xs mt-1">{label}</div>
  </div>
);

type ColorSwatchGroupProps = {
  title: string;
  colors: { label: string; varName: string }[];
};

const ColorSwatchGroup = ({ title, colors }: ColorSwatchGroupProps) => (
  <div className="my-8">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="flex flex-wrap">
      {colors.map((color, i) => (
        <ColorSwatch key={i} {...color} />
      ))}
    </div>
  </div>
);

const ThemePalette = () => {
  const darkTheme = {
    bgLevels: [
      { label: "black90", varName: "bgLevel1" },
      { label: "black85", varName: "bgLevel2" },
      { label: "black80", varName: "bgLevel3" },
      { label: "black75", varName: "bgLevel4" },
      { label: "black70", varName: "bgLevel5" },
    ],
    blue: [
      { label: "blue50", varName: "blue" },
      { label: "blue60", varName: "blueFill" },
    ],
    details: [
      { label: "grey50", varName: "detailMinimal" },
      { label: "white", varName: "detailNeutral" },
      { label: "grey10", varName: "detailNeutralAlt" },
    ],
  };

  const lightTheme = {
    bgLevels: [
      { label: "white5", varName: "bgLevel1" },
      { label: "white10", varName: "bgLevel2" },
      { label: "white15", varName: "bgLevel3" },
      { label: "black70", varName: "bgLevel5" },
    ],
    blue: [
      { label: "blue75", varName: "blue" },
      { label: "blue60", varName: "blueFill" },
    ],
    details: [
      { label: "grey65", varName: "detailMinimal" },
      { label: "grey90", varName: "detailNeutral" },
      { label: "grey80", varName: "detailNeutralAlt" },
    ],
    green: [
      { label: "green75", varName: "green" },
      { label: "green60", varName: "greenFill" },
    ],
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full md:w-1/2 p-6 bg-neutral-900 text-white">
        <h2 className="text-2xl font-bold mb-4">dark-theme</h2>
        <hr className="mb-4 border-gray-600" />
        <ColorSwatchGroup title="bgLevels" colors={darkTheme.bgLevels} />
        <ColorSwatchGroup title="blue" colors={darkTheme.blue} />
        <ColorSwatchGroup title="details" colors={darkTheme.details} />
      </div>
      <div className="w-full md:w-1/2 p-6 bg-white text-black">
        <h2 className="text-2xl font-bold mb-4">light-theme</h2>
        <hr className="mb-4 border-gray-600" />
        <ColorSwatchGroup title="bgLevels" colors={lightTheme.bgLevels} />
        <ColorSwatchGroup title="blue" colors={lightTheme.blue} />
        <ColorSwatchGroup title="details" colors={lightTheme.details} />
        <ColorSwatchGroup title="green" colors={lightTheme.green} />
      </div>
    </div>
  );
};

export default ThemePalette;
