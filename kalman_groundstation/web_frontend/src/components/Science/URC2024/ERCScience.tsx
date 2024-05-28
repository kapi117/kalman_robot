import * as _ from 'lodash'
import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  requestHBridgeState,
  requestLEDState,
  requestPWMState,
  requestSequenceBegin,
  requestSequenceState,
  requestWeightERC,
  setCarouselWithOffset,
  tareWeight,
} from '../../../api/requests'
import { useAppSelector } from '../../../store/storeHooks'
import { SmartProbe } from '../SmartProbe'

const ColumnWrapper = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  & > h5 {
    font-size: 24px;
  }
  border: 1px solid black;
  & > button {
    border: 1px solid black;
  }
  & > button:hover {
    background-color: #ccc;
  }
  & > button:active {
    background-color: #aaa;
  }
`
const ThreeColumnBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  border: 1px solid #ddd;
`

const Column = styled.div`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`

export const ERCScience: () => JSX.Element = () => {
  const [carouselValue, setCarouselValue] = useState<number>(8)
  const [carouselOffset, setCarouselOffset] = useState<number>(0)
  const weight = useAppSelector((state) => state.science.ERCWeight)

  const leds = useAppSelector((state) => state.science.universal.leds)
  const heatingDown = useAppSelector((state) => state.science.universal.heatingDown)
  const heatingUp = useAppSelector((state) => state.science.universal.heatingUp)
  const washer = useAppSelector((state) => state.science.universal.washer)
  const sequenceStates = useAppSelector((state) => state.science.universal.sequenceStates)

  const offsetSetter = useCallback(
    _.throttle((value: number) => {
      setCarouselWithOffset(carouselValue, value)
      setCarouselOffset(value)
    }, 200),
    [carouselValue],
  )

  useEffect(() => {
    offsetSetter(carouselOffset)
  }, [carouselOffset, offsetSetter, carouselValue])

  const incrementOffset = (): void => {
    const newOffset = carouselOffset + 1
    offsetSetter(newOffset)
  }

  const decrementOffset = (): void => {
    const newOffset = carouselOffset - 1
    offsetSetter(newOffset)
  }

  const resetOffset = (): void => {
    const newOffset = 0
    offsetSetter(newOffset)
  }

  return (
    <div>
      <h1>Science</h1>
      <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around' }}>
        <ColumnWrapper>
          <h3>
            UVC LED ({leds[0]}, {leds[1]})
          </h3>
          <br />
          <div>
            <button onClick={(): void => requestLEDState(0, 255)}>LED1 ON</button>
            <button onClick={(): void => requestLEDState(0, 0)}>LED1 OFF</button>
          </div>

          <div>
            <button onClick={(): void => requestLEDState(1, 255)}>LED2 ON</button>
            <button onClick={(): void => requestLEDState(1, 0)}>LED2 OFF</button>
          </div>
          <br />
          <h3>White LED {leds[2]}</h3>
          <div>
            <button onClick={(): void => requestLEDState(2, 255)}>LED3 ON</button>
            <button onClick={(): void => requestLEDState(2, 0)}>LED3 OFF</button>
          </div>
          <h3>Heating</h3>
          <div>
            State: {heatingUp}
            <button onClick={(): void => requestHBridgeState(1, 100, 0)}>UP ON</button>
            <button onClick={(): void => requestHBridgeState(1, 0, 0)}>UP OFF</button>
          </div>
          <div>
            State: {heatingDown}
            <button onClick={(): void => requestHBridgeState(0, 100, 0)}>DOWN ON</button>
            <button onClick={(): void => requestHBridgeState(0, 0, 0)}>DOWN OFF</button>
          </div>
          <h3>Washer</h3>
          <div>
            State: {washer}
            <button onClick={(): void => requestPWMState(1, 255)}>ON</button>
            <button onClick={(): void => requestPWMState(1, 0)}>OFF</button>
          </div>
        </ColumnWrapper>
        <ColumnWrapper>
          <h3>Carousel</h3>
          <div style={{ display: 'flex' }}>
            <span style={{ marginRight: 10, width: 10 }}>{carouselValue}</span>
            <input
              type='range'
              min='1'
              max='16'
              step='1'
              value={carouselValue}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                setCarouselValue(parseInt(e.target.value))
              }}
            />
            <button
              onClick={(): void => setCarouselWithOffset(carouselValue, carouselOffset)}
              style={{ margin: 2, padding: 4 }}
            >
              ReSubmit
            </button>
          </div>
          <div>
            <span style={{ marginRight: 10, width: 50 }}>Offset {carouselOffset} &deg;</span>
            <button onClick={(): void => decrementOffset()} style={{ margin: 2, padding: 4 }}>
              &lt;-
            </button>
            <button onClick={(): void => incrementOffset()} style={{ margin: 2, padding: 4 }}>
              -&gt;
            </button>
            <button onClick={(): void => resetOffset()} style={{ margin: 2, padding: 4 }}>
              zero
            </button>
          </div>
          <br />
          <div>
            {/* <button onClick={(): void => openCloseSampleERC(true)} style={{ margin: 2, padding: 4 }}>
              Open
            </button>
            <button onClick={(): void => openCloseSampleERC(false)} style={{ margin: 2, padding: 4 }}>
              Close
            </button> */}

            <h3>Pouring</h3>
            <ThreeColumnBox>
              <Column>
                <p>Sample 1</p>
                <button onClick={(): void => requestSequenceBegin(1)}>Start seq</button>
                <button onClick={(): void => requestSequenceState(1)}>Seq state</button>
                State: {sequenceStates[0].state}/{sequenceStates[0].stage}
              </Column>
              <Column>
                <p>Sample 2</p>
                <button onClick={(): void => requestSequenceBegin(2)}>Start seq</button>
                <button onClick={(): void => requestSequenceState(2)}>Seq state</button>
                State: {sequenceStates[1].state}/{sequenceStates[1].stage}
              </Column>
              <Column>
                <p>Sample 3</p>
                <button onClick={(): void => requestSequenceBegin(3)}>Start seq</button>
                <button onClick={(): void => requestSequenceState(3)}>Seq state</button>
                State: {sequenceStates[2].state}/{sequenceStates[2].stage}
              </Column>
            </ThreeColumnBox>
            <h3>Weight</h3>

            <button onClick={requestWeightERC} style={{ margin: 2, padding: 4 }}>
              Request weight
            </button>
            <button onClick={tareWeight} style={{ margin: 2, padding: 4 }}>
              Tare weight
            </button>
          </div>
          <span style={{ fontSize: 25 }}>Weight: {weight}g</span>
        </ColumnWrapper>
        <SmartProbe />
      </div>
    </div>
  )
}
