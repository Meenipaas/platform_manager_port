import { Button, message, Form } from 'antd';
import React, { useState, useRef } from 'react';
import {
  PageContainer,
  FooterToolbar,
  ProTable,
  EditableProTable,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { addAgent, removeAgent, getAgentInfos, testAgentConnect } from '@/services/vm';
import { DrawerForm, ProFormText, ProFormGroup } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { isValidIP } from '@/utils';
import { DeployDetail } from './detail';
import { FormattedMessage } from '@umijs/max';

const handleAdd = async (fields: API.AgentInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addAgent({
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
const handleRemove = async (selectedRows: API.AgentInfo[]) => {
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
  const [currentRow, setCurrentRow] = useState<API.AgentInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.AgentInfo[]>([]);
  const [editForm] = Form.useForm();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState([]);

  const operationButton = () => {
    return (
      <Button
        type="link"
        disabled
        onClick={async () => {
          actionRef.current?.reloadAndRest?.();
        }}
      >
        恢复
      </Button>
    );
  };

  const testSShConnect = () => {
    const sshUsr = editForm.getFieldValue('sshUsr');
    const ip = editForm.getFieldValue('ip');
    const sshPassword = editForm.getFieldValue('sshPassword');
    if (!sshUsr || !ip || !sshPassword) {
      message.error('缺失字段，请确认 ip ssh用户 ssh密码的填写');
      return;
    }
    testAgentConnect({
      sshUsr,
      sshPassword,
      ip,
    });
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
        return {};
      },
    },
    {
      title: 'root 用户密码',
      dataIndex: 'rootPassword',
      hideInForm: true,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '是否被使用',
      dataIndex: 'ip',
      hideInForm: true,
      ellipsis: true,
      hideInSearch: true,
      editable: false,
    },
    {
      editable: false,
      title: '创建时间',
      hideInForm: true,
      valueType: 'dateTime',
      dataIndex: 'createdAt',
    },
    {
      editable: false,
      title: '更新时间',
      hideInForm: true,
      valueType: 'dateTime',
      dataIndex: 'updateAt',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        operationButton(),
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
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await waitTime(2000);
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
      <DrawerForm
        title="新增部署"
        form={editForm}
        open={createModalVisible}
        onOpenChange={handleModalVisible}
        onFinish={async (value) => {
          const formData = await editForm.validateFields();
          let success;
          if (formData && formData.id) {
            // success = await handleUpdate(formData as API.AgentInfo);
          } else {
            success = await handleAdd(value as API.AgentInfo);
          }
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText name="id" hidden />
        <ProFormText
          label={'机器IP'}
          rules={[
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
          ]}
          name="ip"
        />
        <ProFormText.Password
          label={'root 用户密码'}
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入root用户的密码',
            },
          ]}
          name="rootPassword"
        />
      </DrawerForm>
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
