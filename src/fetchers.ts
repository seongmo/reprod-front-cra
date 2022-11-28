import axios from 'axios'

type SignUpUser = {
  username: string
  email: string
  password: string
}

export type Step1Data = {step: number; projectName: string; task: string; model: string}

export const postLogin = (cred: void) => axios.post('/auth/login', cred)
export const signup = (user: SignUpUser) => axios.post('/auth/signup', user)

export const getDraft = () => axios('/draft').then((res) => res.data)
export const deleteDraft = () => axios.delete('/draft')
export const saveDraft = (draft: Step1Data) => axios.post('/draft', draft)

export const getProjects = () => axios('/projects').then((res) => res.data)
export const deleteProject = (id: string) => axios.delete(`/projects/${id}`)

export const getProject = (projName: string) =>
  axios(`/projects/${projName}`).then((res) => res.data)
export const getProjectUniq = (projName: string) =>
  axios(`/projects/${projName}/uniq`).then((res) => res.data)
export const getProjectPlots = (projName: string) =>
  axios(`/projects/${projName}/plots`).then((res) => res.data)
export const getProjectCode = (projName: string) =>
  axios(`/projects/${projName}/code`).then((res) => res.data)
export const getProjectMetrics = (projName: string) =>
  axios(`/projects/${projName}/metrics`).then((res) => res.data)
export const getProjectOutput = (projName: string) =>
  axios(`/projects/${projName}/output`).then((res) => res.data)
export const getProjectRequirement = (projName: string) =>
  axios(`/projects/${projName}/requirement`).then((res) => res.data)
export const getProjectAssets = (projName: string) =>
  axios(`/projects/${projName}/assets`).then((res) => res.data)
export const getProjectFile = (projName: string, filepath: string) =>
  axios.post(`/projects/${projName}/file`, {filepath}).then((res) => res.data)
export const getProjectModelCard = (projName: string) =>
  axios.get(`/projects/${projName}/model-card`).then((res) => res.data)
