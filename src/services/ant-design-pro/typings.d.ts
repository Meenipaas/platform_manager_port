// @ts-ignore
/* eslint-disable */

declare namespace API {
  /**
   * agent 信息
   */
  type AgentInfo = {
    id?: string;
    ip: string;
    name: string;
    sshUsr: string;
    sshPassword: string;
    homePath: string;
    status?: AgentStatus;
    platformIP: string;
    clientId: string;
    clientSecret: string;
  };

  type VirtualMachine = {
    id: string;
    hostname?: string;
    ip?: string;
    rootPassword?: string;
    totalMemory?: number;
    created_at?: Date;
    updated_at?: Date;
    agentId?: string;
  };

  type Task = {
    id: string;
    name: string;
    status: string;
    progress: string;
    log?: string;
  };

  interface PerData {
    data: string;
    used: number;
    total: number;
    time: string;
  }

  interface Performance {
    cpu: PerData[];
    memory: PerData[];
    disk: PerData[];
    id?: string;
  }

  //枚举所有的状态
  enum AgentStatus {
    INIT = 'INIT',
    INSTALL = 'INSTALL',
    STARTING = 'STARTING',
    STOPPING = 'STOPPING',
    STOPPED = 'STOPPED',
    UPDATING = 'UPDATING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    RUNNING = 'RUNNING',
    UNINSTALL = 'UNINSTALL',
    CLEANING = 'CLEANING',
  }
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    code?: string;
    message?: string;
    access_token?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
