import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { VictoryChart, VictoryLine, VictoryLegend, VictoryAxis, VictoryTooltip, VictoryTheme, VictoryScatter, VictoryLabel } from 'victory-native';
import { useRoute } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import moment from 'moment';
import PrimaryButton from './PrimaryButton';
const imageWidth = Dimensions.get('window').width;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const Chart = ({ navigation, page, chartHeight, chartWidth, chartStyle, isShowViewButton = true, show }) => {
  const route = useRoute();
  const title = !!route.params ? route.params.title : page;
  const [view, setView] = useState(!!show ? show : 'week')
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handlePointClick = (datum) => {
    setSelectedPoint(datum.label);
  };
  useEffect(() => {
    if (title && !page) {
      navigation.setOptions({ title });
    }
  }, [title]);
  useEffect(() => {
    const fetchData = () => {
      const titleWithNoSpace = title?.replace(/\s/g, '');

      const fetchThingerData = async () => {
        try {
          const response = await fetch(
            'https://api.thinger.io/v1/users/Rnunaunfairy2544/buckets/kar/data?authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJEZXZpY2VDYWxsYmFja19hc3Roc2lzdG1vYmlsZSIsInN2ciI6ImFwLXNvdXRoZWFzdC5hd3MudGhpbmdlci5pbyIsInVzciI6IlJudW5hdW5mYWlyeTI1NDQifQ.U6_SCVtAhAB6Wz0i5Y3zlZHMSmANs2MsWIIyubMNxJo'
          );
          const thingerData = await response.json();
          console.log('Thinger Data:', thingerData);

          // Convert Thinger data to the required format
          const thingerDataArray = thingerData.map((value) => {
            console.log('value:', value);
            const date = new Date(value.ts);
            console.log('date:', date);

            let yValue;
            if (titleWithNoSpace === 'Heartrate') {
              yValue = parseInt(value.val.bpmAvg);
              console.log('value.bpmAvg:', value.val.bpmAvg);
            } else if (titleWithNoSpace === 'SpO2') {
              yValue = parseInt(value.val.spO2);
              console.log('value.SpO2:', value.val.SpO2);
            } else if (titleWithNoSpace === 'Humidity') {
              yValue = parseInt(value.val.humidity);
              console.log('value.humidity:', value.val.humidity);
            } else if (titleWithNoSpace === 'Temperature') {
              yValue = parseInt(value.val.temperature);
              console.log('value.temperature:', value.val.temperature);
            }
            return {
              x: date,
              y: yValue,
            };
          });

          setData(thingerDataArray);

        } catch (error) {
          console.error('Error fetching Thinger data:', error);
        }
      };
      if (titleWithNoSpace === 'Heartrate' || titleWithNoSpace === 'SpO2' || titleWithNoSpace === 'Humidity' || titleWithNoSpace === 'Temperature') {
        fetchThingerData();
      }

      if (titleWithNoSpace === 'PeakFlow' || titleWithNoSpace === 'Inhaler' || titleWithNoSpace === 'AsthmaActivity' || titleWithNoSpace === 'PM2.5') {

        const uid = firebase.auth().currentUser.uid;
        let ref = null;

        if (titleWithNoSpace === 'PeakFlow') {
          ref = db.ref(`/PeakFlowData/${uid}`);
        } else if (titleWithNoSpace === 'Inhaler') {
          ref = db.ref(`/Inhaler/${uid}`);
        } else if (titleWithNoSpace === 'AsthmaActivity') {
          ref = db.ref(`/AsthmaActivityData/${uid}`);
        } else if (titleWithNoSpace === 'PM2.5') {
          ref = db.ref(`/aqi/${uid}`);
        }
        console.log("ref", ref);

        ref.on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const dataArray = Object.entries(data).map(([key, value]) => {
              const date = new Date(value.time);


              let yValue;
              if (titleWithNoSpace === 'PeakFlow') {
                yValue = parseInt(value.peakflow);
              } else if (titleWithNoSpace === 'Inhaler') {
                yValue = parseInt(value.usage);
              } else if (titleWithNoSpace === 'AsthmaActivity') {
                yValue = parseInt(value.activity);
              }
              else if (titleWithNoSpace === 'PM2.5') {
                console.log("value.pm25", value.pm25);
                yValue = parseInt(value.pm25);
              }
              return {
                x: date,
                y: yValue,
              };
            });
            setData(dataArray);
          }
        });
      }
    };
    fetchData();
  }, []);

  const handlePrevDate = () => {
    if (view === 'day') {
      setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
    } else if (view === 'week') {
      setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else if (view === 'month') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    } else if (view === 'year') {
      setSelectedDate(new Date(selectedDate.getFullYear() - 1, 0, 1));
    }
  };

  const handleNextDate = () => {
    if (view === 'day') {
      setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
    } else if (view === 'week') {
      setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else if (view === 'month') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    } else if (view === 'year') {
      setSelectedDate(new Date(selectedDate.getFullYear() + 1, 0, 1));
    }
  };

  // show title depend on day, month year options
  const formatDate = (date, format) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    if (format === 'month') {
      options.month = 'short';
      options.day = undefined;
    } else if (format === 'year') {
      options.month = undefined;
      options.day = undefined;
    }
    return date.toLocaleDateString(undefined, options);
  };
  // const view = 'day'; // change this to 'month'

  let filteredData = data.filter((d) => {
    if (view === 'day') {
      return (
        d.x.getFullYear() === selectedDate.getFullYear() &&
        d.x.getMonth() === selectedDate.getMonth() &&
        d.x.getDate() === selectedDate.getDate()
      );
    } else if (view === 'week') {
      let weekStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - selectedDate.getDay());
      let weekEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - selectedDate.getDay() + 6);
      return (d.x >= weekStart && d.x <= weekEnd);
    } else if (view === 'month') {
      return d.x.getFullYear() === selectedDate.getFullYear() && d.x.getMonth() === selectedDate.getMonth();
    } else if (view === 'year') {
      return d.x.getFullYear() === selectedDate.getFullYear();
    }
  });
  // find average 
  const groupedData = {};
  filteredData.forEach((d) => {
    const date = new Date(d.x);
    const day = date.toDateString();
    const isoDateTime = date.toISOString();
    const dateFromView = view === 'day' ? isoDateTime : day // if view is not day then find avg only date not time
    if (!groupedData[dateFromView]) {
      groupedData[dateFromView] = { x: date, y: [], count: 0 };
    }
    groupedData[dateFromView].y.push(d.y);
    groupedData[dateFromView].count++;
  });

  const groupedDataArray = Object.keys(groupedData).map((dateFromView) => {
    const data = groupedData[dateFromView];
    return { x: data.x, y: data.y.reduce((a, b) => a + b, 0) / data.count };
  });

  // find max 
  const maxData = Object.keys(groupedData).map((day) => {
    const data = groupedData[day];
    const max = Math.max(...data.y);
    return { x: data.x, y: max };
  });

 
  const message =
    title === "Peak Flow" ? "Measure your peak flow regularly to track your lung function and help manage your asthma symptoms! 😊" :
      title === "Inhaler" ? "Make sure you have your inhaler with you at all times and use it as prescribed by your doctor to manage your asthma symptoms! 😊" :
        // title === "medication" ? "Remember to take your asthma medication as prescribed by your doctor to keep your asthma symptoms under control! 😊" :
        title === "Asthma Activity" ? "Check your asthma activity regularly to track your asthma symptoms and identify potential triggers. This will help you take proactive steps to manage your asthma! 😊" :
          null
  // "Remember to measure your peak flow, take your asthma medication, use your inhaler as prescribed, and check your asthma activity regularly to stay on top of your asthma! 😊";

  const tickValues = [];
  if (filteredData.length > 0) {
    const getYear = filteredData[0].x.getFullYear();
    const getMonth = filteredData[0].x.getMonth();
    const getDay = filteredData[0].x.getDate();

    if (view === 'year') {
      for (let i = 0; i < 12; i++) {
        tickValues.push(new Date(getYear, i));
      }
    } else if (view === 'month') {
      const startDate = new Date(getYear, getMonth, 1);
      const endDate = new Date(getYear, getMonth + 1, 0);
      for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
        tickValues.push(new Date(getYear, getMonth, i));
      }
    } else if (view === 'week') {
      const firstDayOfWeek = 0;
      const startDate = new Date(selectedDate);
      startDate.setDate(selectedDate.getDate() - selectedDate.getDay() + firstDayOfWeek);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      for (let i = 0; i < 7; i++) {
        const tickDate = new Date(startDate);
        tickDate.setDate(startDate.getDate() + i);
        tickValues.push(tickDate);
      }
    } else if (view === 'day') {
      tickValues.push(
        new Date(getYear, getMonth, getDay, 0), // 0:00 AM
        new Date(getYear, getMonth, getDay, 6), // 6:00 AM
        new Date(getYear, getMonth, getDay, 12), // 12:00 PM
        new Date(getYear, getMonth, getDay, 18) // 6:00 PM
      );
    }
    console.log('filteredData', filteredData)
  }

  return (
    <View style={styles.container}>
      {filteredData.length <= 0 && isShowViewButton ? (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{formatDate(selectedDate, view)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#C4DCE8', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Image
              source={require('../assets/no-tracking.png')}
              resizeMode='contain'
              style={{ height: 250, opacity: 0.8 }}
            />
            <Text style={styles.titleText}>Hey there!</Text>
            <Text style={styles.text}>Looks like you haven't input any data yet.</Text>
            {!!message && (
              <>
                <Text style={styles.textContent}>{message}</Text>
                <PrimaryButton title={`input ${title}`} onPress={() => navigation.navigate(title)} />
              </>
            )}
          </View>
        </>
      ) :
        <>
          {isShowViewButton && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{formatDate(selectedDate, view)}</Text>
            </View>
          )}
          <View style={[styles.chartContainer, chartStyle]}>
            <VictoryChart
              // theme={{ axis: { style: { tickLabels: { fontSize: 10 } } } }}
              height={!!chartHeight ? chartHeight : 400}
              width={!!chartWidth ? chartWidth : imageWidth}
              padding={{ top: 50, bottom: 100, left: 60, right: 20 }}
              domainPadding={{ x: 10 }}
              theme={VictoryTheme.material}
            >
              <VictoryLegend x={50} y={380}
                orientation="horizontal"
                gutter={20}
                colorScale={["#0097A7", "#FF8A65"]}
                data={[
                  { name: 'Average', symbol: { type: 'minus', fill: '#0097A7' } },
                  { name: 'Max', symbol: { type: 'minus', fill: '#FF8A65' } }
                ]}
              />
              {console.log('tickValues', tickValues)}
              {view === 'day' && (
                <VictoryAxis
                  label="Time"
                  tickCount={4}
                  tickFormat={(x) => {
                    if (!x) {
                      return '';
                    }
                    return new Date(x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }}
                  style={{ tickLabels: { padding: 5 }, axisLabel: { padding: 30 } }}
                  tickValues={tickValues}
                />
              )}
              {view === 'week' && (
                <VictoryAxis
                  label={isShowViewButton ? "Time" : null}
                  tickCount={7}
                  tickFormat={(x) => {
                    if (!x) {
                      return '';
                    }
                    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const dayOfWeek = new Date(x).getDay();
                    return weekdays[dayOfWeek];
                  }}
                  style={{ tickLabels: { padding: 5 }, axisLabel: { padding: 30 } }}
                  tickValues={tickValues}
                />
              )}
              {view === 'month' && (
                <VictoryAxis
                  label="Time"
                  tickCount={4}
                  tickFormat={(x) => {
                    if (!x) {
                      return '';
                    }
                    return new Date(x).getDate();
                  }}
                  style={{ tickLabels: { padding: 5 }, axisLabel: { padding: 30 } }}
                  tickValues={tickValues}
                />
              )}
              {view === 'year' && (
                <VictoryAxis
                  label="Time"
                  tickCount={12}
                  tickFormat={(x) => {
                    if (!x) {
                      return '';
                    }
                    return new Date(x).toLocaleString('default', { month: 'short' });
                  }}
                  tickValues={tickValues}
                  style={{ tickLabels: { padding: 5 }, axisLabel: { padding: 30 } }}
                />
              )}
              <VictoryAxis
                label={
                  isShowViewButton ? (
                    title === 'Peak Flow' ?
                      "Peak Flow (L/min)" :
                      title === 'PM2.5' ?
                        'PM2.5 (µg./m)' :
                        title === 'Heart rate' ?
                          'Heart rate (bpm)' :
                          title === 'SpO2' ?
                            'SpO2 (%)' :
                            title === 'Humidity' ?
                              'Humidity (%)' :
                              title === 'Temperature' ?
                                'Temperature (°C)' :
                                "Number of Times") : null
                }
                dependentAxis
                tickCount={4}
                tickFormat={(tick) => Number(tick).toFixed(2)}
                style={{ tickLabels: { padding: 5 }, axisLabel: { padding: 40 } }}
              />
              {console.log(title)}
              <VictoryLine
                data={groupedDataArray}
                x="x"
                y="y"
                // interpolation="natural"
                style={{ data: { stroke: '#0097A7', strokeWidth: 3 } }}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLine
                data={maxData}
                x="x"
                y="y"
                style={{ data: { stroke: '#FF5722', strokeWidth: 3 } }}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryScatter
                style={{ data: { fill: "orange", opacity: 0.5 } }}
                size={7}
                data={maxData}
                labels={({ datum }) =>
                  `${title === 'Peak Flow' ?
                    `${datum.y.toFixed(2)} L/min` :
                    title === 'PM2.5' ?
                      `${datum.y.toFixed(2)} µg./m` :
                      title === 'Heart rate' ?
                        `${datum.y.toFixed(2)} bpm` :
                        title === 'SpO2' || title === 'Humidity' ?
                          `${datum.y.toFixed(2)} %` :
                          title === 'Temperature' ?
                            `${datum.y.toFixed(2)} °C` :
                            datum.y.toFixed(2) == 1 ?
                              `${datum.y.toFixed(2)} time` :
                              `${datum.y.toFixed(2)} times`}
                      \n ${moment(datum.x).format('DD MMM YYYY, h:mm A')}`
                }
                labelComponent={
                  <VictoryTooltip
                    constrainToVisibleArea
                    cornerRadius={10}
                    flyoutStyle={{ fill: 'orange' }}
                    renderInPortal={false}
                    style={{ fontSize: 10 }}
                  />
                }
                onPress={handlePointClick}
              />
              <VictoryScatter
                style={{ data: { fill: "#72BDB7", opacity: 0.5 } }}
                size={7}
                data={groupedDataArray}
                labels={({ datum }) =>
                  `${title === 'Peak Flow' ?
                    `${datum.y.toFixed(2)} L/min` :
                    title === 'PM2.5' ?
                      `${datum.y.toFixed(2)} µg./m` :
                      title === 'Heart rate' ?
                        `${datum.y.toFixed(2)} bpm` :
                        title === 'SpO2' || title === 'Humidity' ?
                          `${datum.y.toFixed(2)} %` :
                          title === 'Temperature' ?
                            `${datum.y.toFixed(2)} °C` :
                            datum.y.toFixed(2) == 1 ?
                              `${datum.y.toFixed(2)} time` :
                              `${datum.y.toFixed(2)} times`}
                      \n ${moment(datum.x).format('DD MMM YYYY, h:mm A')}`
                }
                labelComponent={
                  <VictoryTooltip
                    cornerRadius={10}
                    flyoutStyle={{ fill: '#72BDB7' }}
                    renderInPortal={false}
                    style={{ fontSize: 10 }}
                    constrainToVisibleArea
                  />
                }
                onPress={handlePointClick}
              />

              {selectedPoint && (
                <VictoryLabel
                  x={selectedPoint.x}
                  y={selectedPoint.y}
                  text={selectedPoint.label}
                />
              )}
            </VictoryChart>
          </View>

        </>
      }
      {isShowViewButton && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePrevDate}>
            <Text style={styles.buttonText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setView('day')} style={[styles.button, view === 'day' && styles.selectedButton]}>
            <Text style={[styles.buttonText, view === 'day' && styles.selectedButtonText]}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setView('week')} style={[styles.button, view === 'week' && styles.selectedButton]}>
            <Text style={[styles.buttonText, view === 'week' && styles.selectedButtonText]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setView('month')} style={[styles.button, view === 'month' && styles.selectedButton]}>
            <Text style={[styles.buttonText, view === 'month' && styles.selectedButtonText]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setView('year')} style={[styles.button, view === 'year' && styles.selectedButton]}>
            <Text style={[styles.buttonText, view === 'year' && styles.selectedButtonText]}>Year</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextDate}>
            <Text style={styles.buttonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  titleContainer: {
    alignItems: 'center',
    backgroundColor: '#C4DCE8',
    padding: 10,
  },
  title: {
    fontFamily: 'Prompt-SemiBold',
    fontSize: 25,
    color: '#517EB9'
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C4DCE8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    backgroundColor: '#C4DCE8',
    alignItems: 'center'
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#517EB9',
  },
  buttonText: {
    fontFamily: 'Prompt-Medium',
    fontSize: 18,
  },
  selectedButtonText: {
    color: 'white',
  },
  text: {
    fontFamily: 'Prompt-Medium',
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 30,
    fontSize: 15,
    marginVertical: 10
  },
  textContent: {
    fontFamily: 'Prompt-Light',
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'Prompt-Bold',
  },
});

export default Chart;
