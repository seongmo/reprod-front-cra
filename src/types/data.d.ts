type ProjectConfig = {
  projectCode: string
  projectName: string
  datafile: string
  task: string
  model: string
  input: string
  target: string
  max_length: number
  manual?: any
  split_type: string
  test?: number
  train?: number
}

// {
//   _id: new ObjectId("6379db22f1f311bd7d9e464d"),
//   userId: new ObjectId("6379d327d191c31a03997b0c"),
//   name: 'df-user1',
//   config: {
//     projectCode: 'df-user1',
//     datafile: 'three_demo.csv',
//     projectName: 'df-user1',
//     task: 'multi-class',
//     model: 'kobert',
//     input: 'PAPER_TEXT',
//     target: 'RCMN_CD1',
//     max_length: 64,
//     manual: [Object],
//     split_type: 'manual',
//     test: 0.3,
//     train: 0.7
//   },
//   status: 'created',
//   createdAt: 2022-11-20T07:45:38.261Z,
//   updatedAt: 2022-11-20T07:45:38.261Z
// }
export type ProjectItem = {
  _id: string
  userId: string
  name: string
  config: ProjectConfig
  // key: string
  description?: string
  isDraft: boolean
  status: string
  startedAt: string | Date | null
  createdAt: string | Date | null
  // pm2Info: Pm2Info
}

export type Pm2Info = {
  pm_id: string
  pm2_env: {
    args: any[]
    exit_code: number
    status: any
    pm_uptime: number
    created_at: string | number
    // name: string
  }
  name: string
}

export type ProjectDraft = {
  step: number
}
