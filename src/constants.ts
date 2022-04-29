import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

export const ERC20Abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",

  // Authenticated Functions
  "function approve(address spender, uint amount) returns (boolean)",
  // Events
  "event Approval(address indexed owner, address indexed spender, uint value)"
];

export const NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const theme = deepMerge(grommet, {
  global: {

    control: {
      border: {
        width: '0px'
      }
    },
    focus: {
      outline: {
        size: '0px'
      }
    },
    colors: {
      'c0': { dark: undefined, light: undefined },
      'c1': { dark: '#131823', light: '#FFFFFF' },
      'c2': { dark: '#06070A', light: '#F3F5FA' },
      'c3': { dark: '#00897B', light: '#00897B' },
      'c4': { dark: '#2F8AF5', lght: '#2F8AF5' }
    }
  },
  layer: {
    border: {
      radius: 'medium',
      intelligentRounding: true,
    },
  },
  select: {
    options: {
      container: {
        size: '5px'
      }
    }
  },
  textInput: {
    extend: `width: 120px; padding: 4px;`
  },
  tip: {
    content: {
      background: "dark-4",
      elevation: "none",
      margin: "none",
      pad: "small",
      round: "small"
    }
  },
  notification: {
    container: {
      border: {
        size: '2px',
        style: 'solid',
        color: '#FF0000'
      },
      round: true
    },
    title: {
      weight: 'normal',
      size: 'small'
    }
  },

});
