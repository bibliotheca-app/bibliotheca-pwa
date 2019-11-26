import { Button, Text, Box } from 'grommet';
import { Download as DownloadIcon } from 'grommet-icons';
import React from 'react';
import { useActions } from 'typeless';
import { ManagementActions } from '../interface';

export const ManagementView = () => {
  const { downloadDeletedBookListAsCsv, downloadBookListAsCsv } = useActions(ManagementActions);

  return (
    <Box>
      <Text margin="none">
        書籍一覧をCSVでダウンロード
        <Button icon={<DownloadIcon />} plain={false} onClick={downloadBookListAsCsv} />
      </Text>
      <Text margin="none">
        削除済みの書籍一覧をCSVでダウンロード
        <Button icon={<DownloadIcon />} plain={false} onClick={downloadDeletedBookListAsCsv} />
      </Text>
    </Box>
  );
};
