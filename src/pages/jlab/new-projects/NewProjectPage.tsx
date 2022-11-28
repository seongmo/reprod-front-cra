import {Box} from '@chakra-ui/react'
import {useQuery} from '@tanstack/react-query'
import {Navigate} from 'react-router-dom'
import {getDraft} from '../../../fetchers'
import {ProjectDraft} from '../../../types/data'
import {NewProjectStep1} from './NewProjectStep1'
import {NewProjectStep2} from './NewProjectStep2'
import {NewProjectStep3} from './NewProjectStep3'
import {NewProjectStep4} from './NewProjectStep4'
import './NewProjectPage.css'

export function NewProject() {
  const {isLoading, data, refetch} = useQuery<ProjectDraft>(['draft'], () => getDraft())

  if (isLoading) {
    return <Box>Loading</Box>
  }

  function reload() {
    setTimeout(() => {
      refetch()
    }, 500)
  }

  console.log({data})
  if (!data || data.step === 0) {
    return <NewProjectStep1 onCreated={() => reload()} />
  }
  if (data.step === 1) {
    return <NewProjectStep2 config={data} onCreated={() => reload()} />
  }
  if (data.step === 2) {
    return <NewProjectStep3 config={data} onCreated={() => reload()} />
  }
  if (data.step === 3) {
    return <NewProjectStep4 config={data} onCreated={() => reload()} />
  }
  return <Navigate to="/projects" />
}
