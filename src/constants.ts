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

export const theme = deepMerge(grommet, {
  global: {
    font: {
      family: "'Metric', Arial, sans-serif",
      face: `
        @font-face {
          font-family: "Metric";
          src: url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXS-Regular.woff2") format('woff2'),
               url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXS-Regular.woff") format('woff');
        }
        @font-face {
          font-family: "Metric";
          src: url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXS-Bold.woff2") format('woff2'),
               url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXS-Bold.woff") format('woff');
          font-weight: 700;
        }
        @font-face {
          font-family: "Metric";
          src: url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXSSemibold-Regular.woff2") format('woff2'),
               url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXSSemibold-Regular.woff") format('woff');
          font-weight: 600;
        }
        @font-face {
          font-family: "Metric";
          src: url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXSMedium-Regular.woff2") format('woff2'),
               url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXSMedium-Regular.woff") format('woff');
          font-weight: 500;
        }
        @font-face {
          font-family: "Metric";
          src: url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXSLight-Regular.woff2") format('woff2'),
               url("https://d3hq6blov2iije.cloudfront.net/fonts/HPEXS-Metric-Fonts/MetricHPEXSLight-Regular.woff") format('woff');
          font-weight: 100;
        }`,
    },
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
      'c1': {dark: '', light: '#FFFFFF'},
      'c2': { dark: '', light: '#F3F5FA'},
      'c3': { dark: '', light: '#00897B'}
    }
  },
  layer: {
    border: {
      radius: 'medium',
      intelligentRounding: true,
    },
  },
  checkBox: {
    size: '18px'
  },
  radioButton: {
    size: '18px'
  },
  select: {
    options: {
      container: {
        size: '5px'
      }
    }
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

});
