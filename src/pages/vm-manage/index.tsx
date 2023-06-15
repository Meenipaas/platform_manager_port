import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar, EditableProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { addVirtualMachine, removeAgent, getAgentInfos, testAgentConnect } from '@/services/vm';
import { isValidIP } from '@/utils';
import { DeployDetail } from './detail';
import { FormattedMessage } from '@umijs/max';

const handleAdd = async (fields: API.VirtualMachine) => {
  const hide = message.loading('正在添加');
  try {
    await addVirtualMachine({
      data: {
        ...fields,
      },
    });
    hide();
    message.success('新增成功');
    return true;
  } catch (error) {
    hide();
    message.error(`新增失败请重试 ${error}`);
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.VirtualMachine[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeAgent({
      data: {
        ids: selectedRows.map((row) => row.id),
      },
    });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.VirtualMachine>();
  const [selectedRowsState, setSelectedRows] = useState<API.VirtualMachine[]>([]);
  const [isTestConnect, setTestConnected] = useState<boolean>(false);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState([]);

  const operationButton = (row: API.VirtualMachine) => {
    return (
      <Button
        type="link"
        onClick={async () => {
          actionRef.current?.startEditable(row.id);
        }}
      >
        编辑
      </Button>
    );
  };

  const testSShConnect = async (vmIp?: string) => {
    setTestConnected(true);
    if (!vmIp) {
      setTestConnected(false);
      return message.error('ip 缺失');
    }
    try {
      await testAgentConnect({
        params: {
          ip: vmIp,
        },
      });
    } catch (error) {
      setTestConnected(false);
    }
    setTestConnected(false);
    message.success('连接成功');
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const columns: ProColumns<API.VirtualMachine>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      editable: false,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              if (entity) {
                setCurrentRow(entity);
                setShowDetail(true);
              }
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      hideInForm: true,
      ellipsis: true,
      hideInSearch: true,
      formItemProps: () => {
        return {
          rules: [
            {
              type: 'string',
              required: true,
              message: '请输入IP',
            },
            {
              validator: (_, value: any) => {
                if (isValidIP(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('非法ip'));
              },
            },
          ],
        };
      },
    },
    {
      title: 'root 用户密码',
      dataIndex: 'rootPassword',
      hideInForm: true,
      ellipsis: true,
      hideInSearch: true,
      render: () => {
        return '******';
      },
      formItemProps: () => {
        return {
          rules: [
            {
              type: 'string',
              required: true,
              message: '请输入root用户的密码',
            },
          ],
        };
      },
    },
    {
      title: '是否被使用',
      dataIndex: 'agentId',
      hideInForm: true,
      ellipsis: true,
      hideInSearch: true,
      editable: false,
      render: (dom, entity) => {
        return entity.agentId ? '是' : '否';
      },
    },
    {
      editable: false,
      title: '创建时间',
      hideInForm: true,
      valueType: 'dateTime',
      dataIndex: 'created_at',
    },
    {
      editable: false,
      title: '更新时间',
      hideInForm: true,
      valueType: 'dateTime',
      dataIndex: 'updated_at',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        operationButton(record),
        <Button
          loading={isTestConnect}
          type="link"
          key="delete"
          onClick={() => {
            testSShConnect(record.ip);
          }}
        >
          测试连接
        </Button>,
        <Button
          danger
          type="link"
          key="delete"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <EditableProTable<API.VirtualMachine, API.PageParams>
        headerTitle="部署列表"
        recordCreatorProps={{
          position: 'top',
          record: () => ({ id: (Math.random() * 1000000).toFixed(0).toString() }),
        }}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data) => {
            await handleAdd(data);
          },
          onChange: setEditableRowKeys,
        }}
        request={getAgentInfos}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            danger
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}
      <DeployDetail
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        columns={columns}
        currentRow={currentRow}
      />
    </PageContainer>
  );
};

export default TableList;
