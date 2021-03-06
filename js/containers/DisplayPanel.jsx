// @flow

import React, { Component } from 'react'
import { Container, Transition, Segment, Header, Icon, Divider } from 'semantic-ui-react'

import TopMenu from '../components/TopMenu'
import PhotoPanel from '../components/Content/PhotoPanel'
import PhotoStats from '../components/Content/PhotoStats'
import TrafficStats from '../components/Traffic/TrafficStats'
import AdditionalStats from '../components/Optional/AdditionalStats'
import PhotoChart from '../components/Content/PhotoChart'
import BarChart from '../components/BarChart'
import TrafficChart from '../components/Traffic/TrafficChart'
import MixedChart from '../components/MixedChart'
import BusinessStats from '../components/Business/BusinessStats'

import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'

class DisplayPanel extends Component {
  state: {
    [string]: boolean
  } = {
    sidemenuVisible: false,
    trafficStats: true,
    trafficChart: true,
    photoPanel: true,
    photoStats: true,
    photoChart: true,
    totalVotes: true,
    businessStats: true,
    goldChart: true,
    additionalStats: true
  }

  props: { data: GoogleData, shuttoutData: ShuttoutData }

  handleCheckboxChange = (event: Event, data: Object) => {
    this.setState({ [data.name]: data.checked })
  }

  handleMenuClick = () => {
    this.setState({
      activeItem: !this.state.activeItem,
      sidemenuVisible: !this.state.sidemenuVisible
    })
  }

  render() {
    const { data, shuttoutData } = this.props

    return (
      <div>
        <TopMenu
          sidemenuVisible={this.state.sidemenuVisible}
          activeItem={this.state.activeItem}
          handleCheckboxChange={this.handleCheckboxChange}
          handleMenuClick={this.handleMenuClick}
        />
        <Container textAlign="center" style={{ marginTop: '5em' }}>
          <Segment>
            <Header as="h2" icon textAlign="center">
              <Icon name="users" circular />
              <Header.Content>Traffic</Header.Content>
            </Header>
            <Transition visible={this.state.trafficStats} animation="fade right" duration={500}>
              <div>
                <TrafficStats
                  visitorsMonth={data.visitorsMonth}
                  visitorsMonthPrevious={data.visitorsMonthPrevious}
                  visitorsDay={data.visitorsDay}
                  visitorsDayPrevious={data.visitorsDayPrevious}
                  activeUsersMonth={data.activeUsersMonth}
                  activeUsersMonthPrevious={data.activeUsersMonthPrevious}
                  activeUsersDay={data.activeUsersDay}
                  activeUsersDayPrevious={data.activeUsersDayPrevious}
                  registrationsMonth={data.registrationsMonth}
                  registrationsMonthPrevious={data.registrationsMonthPrevious}
                  registrationsDay={data.registrationsDay}
                  registrationsDayPrevious={data.registrationsDayPrevious}
                  registeredTotalUsers={data.registeredTotalUsers}
                  unmountOnHide
                />
              </div>
            </Transition>
            <TrafficChart
              visitorsMonthly={data.visitorsMonthly}
              visitorsDaily={data.visitorsDaily}
              activeUsersMonthly={data.activeUsersMonthly}
              activeUsersDaily={data.activeUsersDaily}
              visible={this.state.trafficChart}
              unmountOnHide
            />
          </Segment>
          <Segment>
            <Header as="h2" icon textAlign="center">
              <Icon name="photo" circular />
              <Header.Content>Content</Header.Content>
            </Header>
            <PhotoPanel
              lastUploadedData={shuttoutData.photoLastUploaded}
              ofTheDayData={shuttoutData.photoOfTheDay}
              biggestPrizeData={shuttoutData.photoBiggestPrize}
              visible={this.state.photoPanel}
              unmountOnHide
            />
            <Transition visible={this.state.photoStats} animation="fade down" duration={500}>
              <div>
                <Divider />
                <PhotoStats
                  photosTotalMonth={shuttoutData.photosTotalMonth}
                  photosTotalDay={shuttoutData.photosTotalDay}
                  photosPremiumMonth={shuttoutData.photosPremiumMonth}
                  photosPremiumDay={shuttoutData.photosPremiumDay}
                  unmountOnHide
                />
              </div>
            </Transition>
            <PhotoChart
              photosTotalMonth={shuttoutData.photosTotalMonth}
              photosTotalDay={shuttoutData.photosTotalDay}
              photosPremiumMonth={shuttoutData.photosPremiumMonth}
              photosPremiumDay={shuttoutData.photosPremiumDay}
              visible={this.state.photoChart}
              unmountOnHide
            />
            <Transition visible={this.state.totalVotes} animation="fade down" duration={500}>
              <div>
                <Divider />
                <BarChart
                  customTitle={'Total Votes'}
                  data={shuttoutData.votesTotal}
                  legendPosition="bottom"
                  displayLegend={false}
                  displayTitle
                  unmountOnHide
                />
              </div>
            </Transition>
          </Segment>
          <Segment>
            <Header as="h2" icon textAlign="center">
              <Icon name="money" circular />
              <Header.Content>Business</Header.Content>
            </Header>
            <div>
              <Transition visible={this.state.businessStats} animation="fade up" duration={500}>
                <div>
                  <BusinessStats entryFees={shuttoutData.entryFees} />
                </div>
              </Transition>
            </div>
          </Segment>
          <Transition visible={this.state.goldChart} animation="fade up" duration={500}>
            <div>
              <MixedChart dataOne={shuttoutData.goldTotal} dataTwo={shuttoutData.goldPayedOut} unmountOnHide />
            </div>
          </Transition>
          <Transition visible={this.state.additionalStats} animation="fade left" duration={500}>
            <div>
              <AdditionalStats
                exitRate={parseFloat(data.exitRate).toFixed(2)}
                bounceRate={parseFloat(data.bounceRate).toFixed(2)}
                unmountOnHide
              />
            </div>
          </Transition>
        </Container>
      </div>
    )
  }
}

export default DisplayPanel
