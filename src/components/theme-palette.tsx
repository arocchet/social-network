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
    neutral: [
      { label: "grey10", varName: "neutral" },
      { label: "white", varName: "neutralAlt" },
      { label: "grey15", varName: "neutralFill" },
      { label: "white", varName: "neutralFillAlt" },
      { label: "grey90", varName: "neutralOnFill" },
    ],
    colors: [
      { label: "red100", varName: "red" },
      { label: "teal20", varName: "teal" },
      { label: "purple90", varName: "purple" },
      { label: "blue40", varName: "blue" },
      { label: "orange80", varName: "orange" },
      { label: "yellow90", varName: "yellow" },
      { label: "green60", varName: "green" },
      { label: "pink60", varName: "pink" },
      { label: "grey25", varName: "grey" },
      { label: "lavender30", varName: "lavender" },

    ],
    greyHighlighted: [
      { label: "grey10", varName: "greyHighlighted" },
      { label: "white", varName: "greyHighlightedAlt" },
    ],
    backgrounds: [
      { label: "black90", varName: "bgLevel1" },
      { label: "black85", varName: "bgLevel2" },
      { label: "black80", varName: "bgLevel3" },
      { label: "black75", varName: "bgLevel4" },
      { label: "black70", varName: "bgLevel5" },
    ],
    text: [
      { label: "white", varName: "textNeutral" },
      { label: "grey10", varName: "textNeutralAlt" },
      { label: "grey25", varName: "textMinimal" },
    ],
    details: [
      { label: "white", varName: "detailNeutral" },
      { label: "grey10", varName: "detailNeutralAlt" },
      { label: "grey50", varName: "detailMinimal" },
    ],
    alt: [
      { label: "red50", varName: "redFill" },
      { label: "red90", varName: "redFillAlt" },
      { label: "teal40", varName: "tealAlt" },
      { label: "teal50", varName: "tealFill" },
      { label: "teal70", varName: "tealFillAlt" },
      { label: "purple50", varName: "purpleAlt" },
      { label: "purple80", varName: "purpleFill" },
      { label: "purple100", varName: "purpleFillAlt" },
      { label: "blue60", varName: "blueFill" },
      { label: "sunsetOrange60", varName: "orangeFill" },
      { label: "yellow100", varName: "yellowFill" },
      { label: "green50", varName: "greenFill" },
      { label: "pink40", varName: "pinkFill" },
      { label: "grey50", varName: "greyFill" },
      { label: "black70", varName: "bgLevel5" },
    ]
  };

  const lightTheme = {
    neutral: [
      { label: "grey90", varName: "neutral" },
      { label: "grey60", varName: "neutralAlt" },
      { label: "grey80", varName: "neutralFill" },
      { label: "grey65", varName: "neutralFillAlt" },
      { label: "white", varName: "neutralOnFill" },
    ],
    colors: [
      { label: "red80", varName: "red" },
      { label: "teal30", varName: "teal" },
      { label: "purple70", varName: "purple" },
      { label: "blue90", varName: "blue" },
      { label: "orange90", varName: "orange" },
      { label: "yellow70", varName: "yellow" },
      { label: "green50", varName: "green" },
      { label: "pink20", varName: "pink" },
      { label: "grey60", varName: "grey" },
      { label: "lavender20", varName: "lavender" },
    ],
    greyHighlighted: [
      { label: "grey65", varName: "greyHighlighted" },
      { label: "grey50", varName: "greyHighlightedAlt" },
    ],
    backgrounds: [
      { label: "white5", varName: "bgLevel1" },
      { label: "white10", varName: "bgLevel2" },
      { label: "white15", varName: "bgLevel3" },
      { label: "black70", varName: "bgLevel5" },
    ],
    text: [
      { label: "grey90", varName: "textNeutral" },
      { label: "black85", varName: "textNeutralAlt" },
      { label: "grey80", varName: "textMinimal" },
    ],
    details: [
      { label: "grey90", varName: "detailNeutral" },
      { label: "grey80", varName: "detailNeutralAlt" },
      { label: "grey65", varName: "detailMinimal" },
    ],
  };

  return (
    <div className="flex flex-wrap h-full w-full">
      <div className="w-full md:w-1/2 p-6 bg-neutral-900 text-white">
        <h2 className="text-2xl font-bold mb-4">dark-theme</h2>
        <hr className="mb-4 border-gray-600" />
        <div className="flex flex-wrap flex-row">

          {darkTheme.neutral.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>

        <div className="flex flex-wrap flex-row">
          {darkTheme.backgrounds.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>


        <div className="flex flex-wrap flex-row">
          {darkTheme.colors.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>


        <div className="flex flex-wrap flex-row">
          {darkTheme.alt.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>

        <div className="flex flex-wrap flex-row">
          {darkTheme.details.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>

        <div className="flex flex-wrap flex-row">
          {darkTheme.text.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>


      </div>
      <div className="w-full md:w-1/2 p-6 bg-white text-black">
        <h2 className="text-2xl font-bold mb-4">light-theme</h2>
        <hr className="mb-4 border-gray-600" />
        <div className="flex flex-wrap flex-row">
          {lightTheme.neutral.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>
        <div className="flex flex-wrap flex-row">
          {lightTheme.backgrounds.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>
        <div className="flex flex-wrap flex-row">
          {lightTheme.colors.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>

        <div className="flex flex-wrap flex-row">
          {darkTheme.alt.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>

        <div className="flex flex-wrap flex-row">
          {lightTheme.details.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>

        <div className="flex flex-wrap flex-row">
          {lightTheme.text.map((label, varName) => (
            <ColorSwatch key={varName} label={label.label} varName={label.varName} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ThemePalette;
