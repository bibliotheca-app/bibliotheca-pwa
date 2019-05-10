import { DataTable } from 'grommet';
import styled, { css } from 'styled-components';

export const StyledDataTable = styled(DataTable)`
  /* ストライプ */
  tbody tr:nth-of-type(2n) {
    background-color: #fff;
  }
  tbody tr:nth-of-type(2n + 1) {
    background-color: #f9f9f9;
  }
  tbody tr:hover {
    background-color: #f0f0f0;
  }

  /* レスポンシブ */
  @media only screen and (max-width: 800px) {
    tr,
    th,
    td {
      display: block;
      width: auto;
    }

    /* 枠をつける */
    tr {
      border: 1px solid #dbe1e8;
      border-radius: 5px;
      margin-bottom: 20px;
      padding: 8px 8px 0;
    }

    /* データごとの見た目を調整 */
    th,
    td {
      border: none;
      border-bottom: 1px solid #dbe1e8;
      display: flex;
      justify-content: space-between;
      text-align: right;
    }

    th:last-child,
    td:last-child {
      border-bottom: none;
    }

    /* もともとのスタイルの無効化 */
    th > div,
    th > button > div {
      border: none;
    }

    /*
     * td のデータにヘッダーを用意する
     * aria-* とか attr() を使って実装したほうが綺麗にできるけど既成コンポーネントの限界
     */
    ${({ columns }) => {
      if (!columns) {
        return null;
      }

      const headers = columns.map(column => column.header || '');
      const rawCss = headers
        .map((header, i) => `tbody td:nth-of-type(${i + 1}):before { content: "${header}"; }`)
        .join(); // header 直に埋めるのまずそう

      return css`
        ${rawCss}
      `;
    }}

    td::before {
      /* display: inline-block; */
      display: flex;
      align-items: center;
      font-weight: bold;
      text-align: left;
      padding-right: 20px;
      white-space: nowrap;
    }
  }
`;
