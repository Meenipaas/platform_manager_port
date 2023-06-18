// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function getVMListOrInfos(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  return request<API.VirtualMachine[]>('/api/vm', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getVmInfo(params: { id?: string }) {
  return request<API.VirtualMachine[]>('/api/vm', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/**
 * 新增agent
 * @param options
 * @returns
 */
export async function addVirtualMachine(options?: Record<string, any>) {
  return request<Record<string, any>>('/api/vm', {
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 卸载agent
 * @param options
 * @returns
 */
export async function removeVMs(options?: Record<string, any>) {
  return request<Record<string, any>>('/api/vm', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 * 新增agent
 * @param options
 * @returns
 */
export async function testAgentConnect(options?: Record<string, any>) {
  return request<Record<string, any>>('/api/vm/connect', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function updateBasicVirtualMachine(options?: Record<string, any>) {
  return request<API.Performance>('/api/vm/basic_info', {
    method: 'put',
    ...(options || {}),
  });
}
