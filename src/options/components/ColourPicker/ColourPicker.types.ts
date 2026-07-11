import { Color, ColorChangeHandler } from 'react-color';
import { DEFAULT_COLOUR_PICKER_COLOURS } from '../../../utils/colours';

export type ColourPickerProps = {
  colour: Color;
  colours?: string[];
  onChangeComplete?: ColorChangeHandler;
};

export { DEFAULT_COLOUR_PICKER_COLOURS };
