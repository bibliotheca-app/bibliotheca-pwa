import { Button, Text } from 'grommet';
import { Download as DownloadIcon } from 'grommet-icons';
import React from 'react';
import { useActions } from 'typeless';
import { ManagementActions } from '../interface';

export const ManagementView = () => {
  const { downloadBookListAsCsv } = useActions(ManagementActions);

  return (
    <Text margin="none">
      書籍一覧をCSVでダウンロード
      <Button icon={<DownloadIcon />} plain={false} onClick={() => downloadBookListAsCsv()} />
    </Text>
  );
};
