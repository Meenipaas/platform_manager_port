import { getVmInfo } from '@/services/vm';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { StatisticCard } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import { useEffect, useRef } from 'react';
const { Divider } = StatisticCard;

const refreshTimeIdMap: any = {};

export function DeployDetail({
  open,
  onClose,
  currentRow,
  columns,
}: {
  open: boolean;
  onClose: () => void;
  currentRow?: API.VirtualMachine;
  columns: ProColumns<API.VirtualMachine>[];
}) {
  const ref = useRef<ActionType>();

  // 两秒刷新一次
  useEffect(() => {
    if (!open) {
      Object.keys(refreshTimeIdMap).forEach((key) => {
        clearInterval(refreshTimeIdMap[key]);
      });
      return;
    }

    refreshTimeIdMap.base = setInterval(() => {
      if (ref && ref.current) {
        ref.current.reload();
      }
    }, 2000);
  }, [currentRow?.id, open]);

  return (
    <Drawer width="80%" open={open} onClose={onClose} closable={false}>
      {currentRow?.id && (
        <>
          <ProDescriptions<API.VirtualMachine>
            title={'基本信息'}
            column={1}
            actionRef={ref}
            // title={currentRow?.hostname}
            request={getVmInfo}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.VirtualMachine>[]}
          >
            <ProDescriptions.Item span={1}>
              <StatisticCard.Group direction={'row'} title="性能">
                <Divider type="vertical" />
                <Divider type="vertical" />
              </StatisticCard.Group>
            </ProDescriptions.Item>
          </ProDescriptions>
        </>
      )}
    </Drawer>
  );
}
