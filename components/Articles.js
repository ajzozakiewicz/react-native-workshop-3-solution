import React, { Component } from 'react'
import { View, Text, ListView, StyleSheet } from 'react-native'

const checkStatus = (response) => {
  if (!response.ok) { // status in the range 200-299 or not
    return Promise.reject(new Error(response.statusText || 'Status not OK'))
  }
  return response
}

const parseJSON = (response) => response.json()

const makeFetch = (url, options) => fetch(url, options)
  .then(checkStatus)
  .then(parseJSON)

class Loader extends React.Component {
  render() {
    return (<Text>Loading...</Text>);
  }
}

class ArticlesScreen extends React.Component {
  static navigationOptions = {
    title: 'Articles',
  };

  constructor(props) {
    super(props)
    this.state = {
      hasFetched: false,
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    };
  }

  componentDidMount() {
    makeFetch('https://jsonplaceholder.typicode.com/posts').then((data) => {
      this.setState(() => {
        return {
          hasFetched: true,
          dataSource: this.state.dataSource.cloneWithRows(data)
        };
      })
    })
  }

  render() {
    const { hasFetched, dataSource } = this.state;
    return (
      <View>
        { hasFetched ?
          <ListView
            dataSource={dataSource}
            renderRow={(rowData) => <Text style={listStyles.text}>{rowData.title}</Text>}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={listStyles.separator} />}
          />
          : <Loader />
        }
      </View>
    );
  }
}

export default ArticlesScreen

const listStyles = StyleSheet.create({
  text: {
    marginLeft: 12,
    fontSize: 16,
    padding: 20
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});
