import { Layer } from 'grommet';
import styled, { css } from 'styled-components';

// メディアクエリ周りは semantic-ui の Modal が参考になっている

export type Size = 'mini' | 'tiny' | 'small' | 'large';
export type DisplaySize = 'small' | 'medium' | 'large';

const RATIO: Record<Size, number> = {
  mini: 0.4,
  tiny: 0.6,
  small: 0.8,
  large: 1.2,
};

const BREAK_POINTS: Record<DisplaySize, string> = {
  small: `${320 - 1}px`,
  medium: `${768 - 1}px`,
  large: `${1536 - 1}px`,
};

const BASE_WIDTH: Record<DisplaySize, string> = {
  // 順序に意味あり
  large: '900px',
  small: '95%',
  medium: '88%',
};

const DisplaySizes: DisplaySize[] = Object.keys(BASE_WIDTH) as any;

const Media = Object.entries(BREAK_POINTS).reduce((acc, [size, width]) => {
  return {
    ...acc,
    [size]: (...args: Parameters<typeof css>) => css`
      @media only screen and (${size === 'large' ? 'max' : 'min'}-width: ${width}) {
        ${css(...args)}
      }
    `,
  };
}, {} as Record<DisplaySize, typeof css>);

export const StyledLayer = styled(Layer)`
  ${(props: { size: Size }) =>
    DisplaySizes.map(ds => {
      return css`
        ${Media[ds]`
          width: calc(${BASE_WIDTH[ds]} * ${RATIO[props.size]});
        `}
      `;
    })}
`;
