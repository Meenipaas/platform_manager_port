// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function getAgentInfos(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  return request<API.AgentInfo[]>('/api/agent', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getAgentDetail(params: { id?: number }) {
  return request<API.AgentInfo[]>('/api/agent', {
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
export async function addAgent(options?: Record<string, any>) {
  return request<Record<string, any>>('/api/agent', {
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 卸载agent
 * @param options
 * @returns
 */
export async function removeAgent(options?: Record<string, any>) {
  return request<Record<string, any>>('/api/agent', {
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
  return request<Record<string, any>>('/api/agent/test', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function getTask(options?: Record<string, any>) {
  return request<API.Task>('/api/task', {
    method: 'get',
    ...(options || {}),
  });
}

export async function getPerformance(options?: Record<string, any>) {
  return request<API.Performance>('/api/performance', {
    method: 'get',
    ...(options || {}),
  });
}
