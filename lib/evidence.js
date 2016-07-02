import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager, PageItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';
import lowerCaseFirstLetter from './lowerCaseFirstLetter';
import List from './list';

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      evidenceDescription: ''
    };
  },
  componentWillMount() {
    this.bindAsArray(this.props.beliefRef.child('evidence'), 'evidence');
  },
  render() {
    const belief = this.props.belief;
    const evidence = this.state.evidence;
    const beliefs = this.props.beliefs;
    const beliefId = belief['.key'];
    const index = beliefs.indexOf(b => b['.key'] === beliefId);
    const createHref = this.props.router.createHref;

    let previousText = 'Beliefs';
    let previousHref = '/adversities/' + belief.adversityId;

    if (index > 0) {
      previousText = 'Previous Belief';
      previousHref = '/beliefs/' + beliefs[index - 1]['.key'] + '/alternatives';
    }

    return(belief ?
      <div>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>
            What evidence is there that&nbsp;
            {lowerCaseFirstLetter(belief.description)}?
          </ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl type='text' 
                           placeholder='Evidence' 
                           value={this.state.evidenceDescription}
                           onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button type="submit" disabled={this.state.isSaving}>Add</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        <List value={this.state.evidence}/>
        <Pager>
          <PageItem previous href={createHref(previousHref)}>
            &larr; {previousText}
          </PageItem>
          <PageItem next href={createHref(`/beliefs/${beliefId}/alternatives`)}>
            Alternatives &rarr;
          </PageItem>
        </Pager>
      </div>
      :
      <div/>
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({evidenceDescription: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({isSaving: true});

    this.firebaseRefs.evidence.push({
      description: this.state.evidenceDescription
    }).then(() => {
      this.setState({evidenceDescription: '', isSaving: false});
    });
  }
}));