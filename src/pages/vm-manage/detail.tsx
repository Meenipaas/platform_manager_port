import { getAgentDetail, getPerformance, getTask } from '@/services/agent';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { StatisticCard } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';
import { Drawer, Space, Statistic } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ActiveChart } from '@/components/Chart';
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
  currentRow?: API.AgentInfo;
  columns: ProColumns<API.AgentInfo>[];
}) {
  const ref = useRef<ActionType>();
  const refTask = useRef<ActionType>();
  const [performanceInfo, setPerformance] = useState<API.Performance>();

  const getPermeanceByAgentId = async (agentId: string) => {
    const data = await getPerformance({ agentId });
    setPerformance(data);
  };

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

    refreshTimeIdMap.task = setInterval(() => {
      if (refTask && refTask.current) {
        refTask.current.reload();
      }
    }, 2000);

    refreshTimeIdMap.performance = setInterval(() => {
      getPermeanceByAgentId(currentRow?.id || '');
    }, 5 * 60 * 1000);
  }, [currentRow?.id, open]);

  return (
    <Drawer width="50%" open={open} onClose={onClose} closable={false}>
      {currentRow?.id && (
        <>
          <ProDescriptions<API.AgentInfo>
            column={1}
            actionRef={ref}
            title={currentRow?.name}
            request={getAgentDetail}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.AgentInfo>[]}
          />
          <ProDescriptions
            column={1}
            request={getTask}
            params={{
              agentId: currentRow?.id,
            }}
            columns={[
              {
                title: '任务执行进度',
                dataIndex: 'progress',
                hideInForm: true,
                ellipsis: true,
                hideInSearch: true,
                valueType: 'progress',
              },
              {
                title: '任务日志',
                dataIndex: 'log',
                hideInForm: true,
                ellipsis: true,
                hideInSearch: true,
                valueType: 'code',
              },
            ]}
          />
          <ProDescriptions column={1} title={'性能'}>
            <ProDescriptions.Item span={1}>
              <StatisticCard.Group direction={'row'}>
                <StatisticCard
                  statistic={{
                    title: 'CPU使用率',
                    suffix: '%',
                    value: performanceInfo?.cpu[performanceInfo?.cpu.length - 1].data,
                  }}
                  chart={<ActiveChart data={performanceInfo?.cpu} />}
                />
                <Divider type="vertical" />
                <StatisticCard
                  statistic={{
                    suffix: '%',
                    value: performanceInfo?.memory[performanceInfo?.memory.length - 1].data,
                    title: '内存使用率',
                    description: (
                      <Space>
                        <Statistic
                          title="已使用"
                          value={performanceInfo?.memory[performanceInfo?.memory.length - 1].used}
                        />
                        <Statistic
                          title="总内存"
                          value={performanceInfo?.memory[performanceInfo?.memory.length - 1].total}
                        />
                      </Space>
                    ),
                  }}
                  chart={<ActiveChart data={performanceInfo?.memory} />}
                />
                <Divider type="vertical" />
                <StatisticCard
                  statistic={{
                    title: '空间',
                    suffix: '%',
                    value: performanceInfo?.disk[performanceInfo?.disk.length - 1].data,
                    description: (
                      <Space>
                        <Statistic
                          title="已使用"
                          value={performanceInfo?.disk[performanceInfo?.disk.length - 1].used}
                        />
                        <Statistic
                          title="总空间"
                          value={performanceInfo?.disk[performanceInfo?.disk.length - 1].total}
                        />
                      </Space>
                    ),
                  }}
                  style={{
                    width: '100%',
                  }}
                  chart={<ActiveChart data={performanceInfo?.disk} />}
                />
              </StatisticCard.Group>
            </ProDescriptions.Item>
          </ProDescriptions>
        </>
      )}
    </Drawer>
  );
}
