import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {omit, range} from 'lodash'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './NewProjectPage.css'

/*
- learning_rate(lr): 10.0부터 0.0000000001(1e-10)정도까지
- max_length:
  - kobert: 2 ~ 512
  - kogpt2: 2, 4, 8, 16, 32, … ,1024
- n_epochs: 1, 2, 3, 4, 5, 6까지 가능
- batch_size: 2, 4, 8, 16, 32, 64, 128, 256, 512
- dropout
  - kobert: X
  - kogpt2: 0.1, 0.2, 0.3, …, .0.99
*/

function AutoView() {
  return (
    <Box>
      <Box border="1px solid #bbb" bg="#eee" borderRadius="8px" p={4}>
        <p>Auto를 선택하신 경우</p>
        <p>AutoML을 통해 자동으로 하이퍼파라미터가 튜닝됩니다.</p>
      </Box>
    </Box>
  )
}

function cvtPercentToExp(per: number) {
  return Number(Math.pow(10, 1 - per * 1.01).toExponential(0))
}

function LearningRateInput() {
  const [per, setPer] = useState<number>(6)
  const [lr, setLr] = useState(cvtPercentToExp(per))

  function handlePercentChange(value: number) {
    setPer(value)
    setLr(cvtPercentToExp(value))
  }

  return (
    <FormControl mb={3}>
      <FormLabel>learning_rate</FormLabel>
      <Input name="lr" value={lr} disabled />
      <Slider aria-label="slider-ex-1" value={per} onChange={handlePercentChange}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </FormControl>
  )
}

function ManualKoBert() {
  return (
    <Box>
      <FormControl>
        <FormLabel>Epoch</FormLabel>
        <NumberInput name="n_epochs" defaultValue={3} min={1} max={6}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel>max_length</FormLabel>
        <NumberInput name="max_length" defaultValue={64} min={2} max={512}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <LearningRateInput />
      <FormControl>
        <FormLabel>batch_size</FormLabel>
        <Select name="batch_size" defaultValue={8}>
          {range(9).map((n) => (
            <option key={n}>{2 ** (n + 1)}</option>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
function ManualKoGpt2() {
  return (
    <Box>
      <FormControl>
        <FormLabel>Epoch</FormLabel>
        <NumberInput name="n_epochs" defaultValue={3} min={1} max={20}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel>max_length</FormLabel>
        <Select name="max_length" defaultValue={64}>
          {range(10).map((n) => (
            <option key={n}>{2 ** (n + 1)}</option>
          ))}
        </Select>
      </FormControl>
      <LearningRateInput />
      <FormControl>
        <FormLabel>batch_size</FormLabel>
        <Select name="batch_size" defaultValue={8}>
          {range(9).map((n) => (
            <option key={n}>{2 ** (n + 1)}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Dropout</FormLabel>
        <NumberInput
          name="dropout"
          defaultValue={0.2}
          min={0.1}
          max={0.99}
          precision={2}
          step={0.1}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </Box>
  )
}

const deleteDraft = () => axios.delete('/draft')

export function NewProjectStep4({
  config,
  onCreated,
}: {
  config: any
  onCreated: () => void
}) {
  const [hyparams, setHyparams] = useState<string>('manual')
  const navigate = useNavigate()
  const deleteMut = useMutation(deleteDraft, {
    onSuccess: (res) => {
      navigate(`../dashboard/projects`)
    },
  })
  const mutation = useMutation(
    (config: any) => {
      console.log('start')
      return axios.post('/projects', config)
    },
    {
      onSuccess: (res) => {
        deleteMut.mutate()
      },
    },
  )
  console.log(config)
  return (
    <Center>
      <form
        onSubmit={(e) => {
          e.preventDefault()

          const args: any = {
            ...omit(config, 'step'),
            // hyparams,
          }
          const elm = e.currentTarget
          if (!elm) return

          if (hyparams === 'manual') {
            // @ts-ignore
            args.max_length = Number(elm.querySelector('[name=max_length]').value)
            const manual = {
              // @ts-ignore
              n_epochs: Number(elm.querySelector('[name=n_epochs]').value),
              // @ts-ignore
              lr: elm.querySelector('[name=lr]').value,
              // @ts-ignore
              batch_size: Number(elm.querySelector('[name=batch_size]').value),
            }

            if (config.model === 'kogpt2') {
              // @ts-ignore
              manual.dropout = Number(elm.querySelector('[name=dropout]').value)
            }
            args.manual = manual
          } else {
            args.auto = true
            args.max_length = 32
          }
          console.log(args)

          mutation.mutate(args as any)
        }}
      >
        <Box border="1px solid #ddd" p={8} mt={10} minW="600px">
          {/* <Box>New Project</Box> */}
          <Heading as="h2" size="md" mb={6}>
            New Project
          </Heading>
          <Heading as="h4" size="sm" mb={2}>
            {config.projectName}
          </Heading>
          {/* <Heading as="h5" size="xs" mb={4}>
            Select hyperparameter search
          </Heading> */}

          <Box fontWeight="bold">Select hyperparameter search</Box>
          <RadioGroup value={hyparams} onChange={setHyparams} mb={4}>
            <Flex alignItems="flex-start">
              <Radio value="manual" mr={5}>
                Manual
              </Radio>

              <Divider orientation="vertical" />
              <Radio value="auto" flex={1}>
                Auto
              </Radio>
            </Flex>
          </RadioGroup>
          {/* <ManualKoGpt2 /> */}
          {hyparams === 'manual' &&
            (config.model === 'kobert' ? (
              <ManualKoBert />
            ) : config.model === 'kogpt2' ? (
              <ManualKoGpt2 />
            ) : null)}
          {hyparams === 'auto' && <AutoView />}

          <Flex justifyContent="space-between" mt={4}>
            <Button colorScheme="teal" isLoading={mutation.isLoading} type="submit">
              Start Models Training
            </Button>
            <Button type="button" onClick={() => deleteMut.mutate()}>
              Cancel
            </Button>
          </Flex>
        </Box>
      </form>
    </Center>
  )
}
