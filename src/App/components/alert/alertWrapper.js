// react
import React, { Component } from 'react';
import { connect } from 'react-redux';
// libraries
import { View } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
// own component
import Alert from '../../components/alert/Alert';
import { ALERT } from '../../constants/ActionConst';
// styles

export const alertWrapper = (WrappedComponent) => {
    const wrappedComp = class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                alertEnabled: false,
            }
        }

        componentWillReceiveProps(nextProps) {
            const { alert = {} } = this.props;
            const { alert: nextAlert = {} } = nextProps;

            if (nextAlert !== alert && Object.keys(nextAlert).length) {
                this.showError();
            }
        }

        showError = () => {
            this.setState({alertEnabled: true});
        };

        hideError = () => {
            this.setState({alertEnabled: false});
            this.props.resetAlert();
        };

        render() {
            const { alert = {} } = this.props;
            const { alertEnabled } = this.state;
            return (
                <View style={{flex: 1}}>
                    <WrappedComponent {...this.props}/>
                    {alertEnabled && <Alert {...alert} cancelPress={this.hideError}/>}
                </View>
            )
        }

    };
    const mapStateToProps = state => ({
        alert: state.alert,
    });
    const dispatchers = dispatch => ({
        resetAlert: () => {
            dispatch({type: ALERT.RESET});
        }
    });
    // обернутый компонент теряет статик методы, это решает проблему
    hoistNonReactStatic(wrappedComp, WrappedComponent);

    return connect(mapStateToProps, dispatchers)(wrappedComp);
};