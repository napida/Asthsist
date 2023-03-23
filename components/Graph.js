import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { VictoryChart, VictoryLine, VictoryLegend, VictoryAxis, VictoryTooltip, VictoryTheme, VictoryScatter } from 'victory-native';
import { useRoute } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import { format, parseISO, parse } from 'date-fns';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// static data
// if you do the back-end, you have to get the highest peakflow in the same day
// const data = [
//   { x: new Date('2022-01-01T08:00:00Z'), y: 400 },
//   { x: new Date('2022-01-02T12:00:00Z'), y: 450 },
//   { x: new Date('2022-01-01T16:00:00Z'), y: 500 },
//   { x: new Date('2022-01-01T20:00:00Z'), y: 450 },
//   { x: new Date('2022-01-02T08:00:00Z'), y: 500 },
//   { x: new Date('2022-01-02T12:00:00Z'), y: 550 },
//   { x: new Date('2022-01-02T16:00:00Z'), y: 600 },
//   { x: new Date('2022-01-02T20:00:00Z'), y: 550 },
//   { x: new Date('2022-01-03T08:00:00Z'), y: 600 },
//   { x: new Date('2022-11-03T12:00:00Z'), y: 650 },
//   { x: new Date('2023-11-03T16:00:00Z'), y: 700 },
//   { x: new Date('2023-11-03T20:00:00Z'), y: 650 },
// ];

const db = firebase.database();

const Chart = ({ navigation, title, value, datetime }) => {
  const route = useRoute();
  const [view, setView] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date('2022-03-03T00:00:00Z'));
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {

      const title = route.params.name.replace(/\s/g, '');
      console.log('title', title);

      const uid = firebase.auth().currentUser.uid;
      let ref = null;

      if (title === 'PeakFlow') {
        ref = db.ref(`/PeakFlowData/${uid}`);
      } else if (title === 'Inhaler') {
        ref = db.ref(`/Inhaler/${uid}`);
      } else if (title === 'AsthmaActivity') {
        ref = db.ref(`/AsthmaActivityData/${uid}`);
      }

      ref.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log('data', data);
        if (data) {
          const dataArray = Object.entries(data).map(([key, value]) => {
            const date = new Date(value.time);
            console.log('date', date, 'valid', !isNaN(date), 'timeforref', value.timeforref);

            let yValue;
            if (title === 'PeakFlow') {
              yValue = parseInt(value.peakflow);
            } else if (title === 'Inhaler') {
              yValue = parseInt(value.usage);
            } else if (title === 'AsthmaActivity') {
              yValue = parseInt(value.activity);
            }
            return {
              x: date,
              y: yValue,
            };
          });
          setData(dataArray);
          console.log('dataArray', dataArray);
        }
      });
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
    if (view === 'day' || view === 'week') {
      return (
        d.x.getFullYear() === selectedDate.getFullYear() &&
        d.x.getMonth() === selectedDate.getMonth() &&
        d.x.getDate() === selectedDate.getDate()
      );
    } else if (view === 'month') {
      return d.x.getFullYear() === selectedDate.getFullYear() && d.x.getMonth() === selectedDate.getMonth();
    } else if (view === 'year') {
      return d.x.getFullYear() === selectedDate.getFullYear();
    }
  });

  // find average of Peak Flow
  const groupedData = {};
  filteredData.forEach((d) => {
    const date = new Date(d.x);
    const day = date.toDateString();
    if (!groupedData[day]) {
      groupedData[day] = { x: date, y: [], count: 0 };
    }
    groupedData[day].y.push(d.y);
    groupedData[day].count++;
  });

  const groupedDataArray = Object.keys(groupedData).map((day) => {
    const data = groupedData[day];
    return { x: data.x, y: data.y.reduce((a, b) => a + b, 0) / data.count };
  });

  // find max of Peak Flow
  const maxPeakFlowData = Object.keys(groupedData).map((day) => {
    const data = groupedData[day];
    const maxPeakFlow = Math.max(...data.y);
    return { x: data.x, y: maxPeakFlow };
  });



  // const getMaxPeakFlowForDay = (data, date) => {
  //   const filteredData = data.filter(d => {
  //     const dDate = new Date(d.x);
  //     return (
  //       dDate.getFullYear() === date.getFullYear() &&
  //       dDate.getMonth() === date.getMonth() &&
  //       dDate.getDate() === date.getDate()
  //     );
  //   });
  //   if (filteredData.length === 0) {
  //     return null; // no data for this day
  //   }
  //   return filteredData.reduce((max, d) => {
  //     return d.y > max ? d.y : max;
  //   }, filteredData[0].y);
  // }
  // const maxPeakFlow = getMaxPeakFlowForDay(data, selectedDate);
  // console.log(maxPeakFlow)
  return (
    <View style={styles.container}>
      {filteredData.length <= 1 ? (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{formatDate(selectedDate, view)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#C4DCE8', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.noDataText}>Looks like you haven't measured your peak flow in a while, why not take a reading now?</Text>
            <Button title={`input ${route.params.name}`} onPress={() => navigation.navigate(route.params.name)} />
          </View>
        </>
      ) :
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{formatDate(selectedDate, view)}</Text>
          </View>
          <View style={styles.chartContainer}>
            <VictoryChart
              // theme={{ axis: { style: { tickLabels: { fontSize: 10 } } } }}
              height={300}
              padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
              domainPadding={{ x: 10 }}
              theme={VictoryTheme.material}
            >
              <VictoryLegend x={50} y={280}
                orientation="horizontal"
                gutter={20}
                colorScale={["#0097A7", "#FF8A65"]}
                data={[
                  { name: 'Average', symbol: { type: 'minus', fill: '#0097A7' } },
                  { name: 'Max', symbol: { type: 'minus', fill: '#FF8A65' } }
                ]}
              />

              <VictoryAxis
                label="time"
                tickCount={4}
                tickFormat={(x) => {
                  if (!x) {
                    return '';
                  }
                  if (view === 'day') {
                    return new Date(x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  } else if (view === 'week') {
                    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const dayOfWeek = new Date(x).getDay();
                    return weekdays[dayOfWeek];
                  } else if (view === 'month') {
                    return new Date(x).getDate();
                  } else if (view === 'year') {
                    return new Date(x).toLocaleString('default', { month: 'short' });
                  }
                }}
                style={{ tickLabels: { padding: 5 } }}
              />
              <VictoryAxis
                label="Peakflow (L/min)"
                dependentAxis
                tickCount={4}
                domain={[400, 700]} // set the y-axis domain to be between 500 and 1000
                style={{ tickLabels: { padding: 5 } }}
              />
              <VictoryLine
                data={groupedDataArray}
                x="x"
                y="y"
                // interpolation="natural"
                style={{ data: { stroke: '#0097A7', strokeWidth: 3 } }}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLine
                data={maxPeakFlowData}
                x="x"
                y="y"
                style={{ data: { stroke: '#FF5722', strokeWidth: 3 } }}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryScatter
                style={{ data: { fill: "#72BDB7" } }}
                size={7}
                data={groupedDataArray}
              />
              <VictoryScatter
                style={{ data: { fill: "orange" } }}
                size={7}
                data={maxPeakFlowData}
              />
            </VictoryChart>
          </View>

        </>
      }
      <View style={styles.buttonContainer}>
        <Button title="<" onPress={handlePrevDate} />
        <Button title="Day" onPress={() => setView('day')} />
        <Button title="Week" onPress={() => setView('week')} />
        <Button title="Month" onPress={() => setView('month')} />
        <Button title="Year" onPress={() => setView('year')} />
        <Button title=">" onPress={handleNextDate} />
      </View>
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
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  noDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
    margin: 30,
  },
});

export default Chart;
