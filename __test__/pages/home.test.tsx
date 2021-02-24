import React from 'react';
import { shallow } from 'enzyme';
import HomePage from '../../src/pages/home.page';
describe('登入页面', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<HomePage />);
  });

  afterAll(() => {
    wrapper.unmount();
  });
  it('测试demo', () => {
    console.log(wrapper.state());
  })
})