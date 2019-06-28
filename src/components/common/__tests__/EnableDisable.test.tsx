/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * EnableDisable component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { shallow, ShallowWrapper } from "enzyme";
import {
  EnableDisable,
  EnableDisableContainer,
  EnableDisableProps,
  EnableDisableState,
  TranslatedEnableDisable
} from "../EnableDisable";
import React, { ChangeEvent, FormEvent, MouseEvent } from "react";
import { StatusContext, StatusContextType } from "../context/StatusContext";
import NavButton from "../NavButton";
import NavDropdown from "../NavDropdown";
import { Form, Input, Modal, ModalFooter, ModalHeader } from "reactstrap";

const tick = global.tick;

type EnableDisableWrapper = ShallowWrapper<
  EnableDisableProps,
  EnableDisableState,
  EnableDisable
>;

describe("EnableDisableContainer", () => {
  it("should use context", () => {
    const context: StatusContextType = {
      status: "unknown",
      refresh: jest.fn()
    };

    const wrapper = shallow(
      <StatusContext.Provider value={context}>
        <EnableDisableContainer />
      </StatusContext.Provider>
    )
      .dive()
      .dive()
      .dive();

    const props = wrapper.find(EnableDisable).props();

    expect(props.status).toEqual(context.status);
    expect(props.refresh).toEqual(context.refresh);
  });
});

describe("EnableDisable", () => {
  const defaultProps: EnableDisableProps = {
    refresh: jest.fn(),
    status: "unknown",
    onSetStatus: jest.fn()
  };

  const renderEnableDisable = (
    props: Partial<EnableDisableProps>
  ): EnableDisableWrapper => {
    return shallow(
      <TranslatedEnableDisable {...defaultProps} {...props} />
    ).dive() as EnableDisableWrapper;
  };

  describe("API calls", () => {
    /**
     * Test clicking on a button and expecting it to call setStatus
     *
     * @param initialStatus The initial status
     * @param buttonIndex The index of the button to click
     * @param setStatusArgs The arguments that are expected for setStatus
     * @param expectedStatus The expected status given to to refresh function
     */
    const testCall = async (
      initialStatus: Status,
      buttonIndex: number,
      setStatusArgs: Array<any>,
      expectedStatus: any
    ) => {
      const setStatus = jest.fn(() =>
        Promise.resolve({ status: "success" } as ApiSuccessResponse)
      );
      const refresh = jest.fn();

      const wrapper = renderEnableDisable({
        refresh,
        status: initialStatus,
        onSetStatus: setStatus
      });

      wrapper
        .find(NavButton)
        .at(buttonIndex)
        .props()
        .onClick({} as MouseEvent);

      // Wait for the setStatus promise to resolve
      await tick();

      expect(setStatus).toHaveBeenCalledWith(...setStatusArgs);
      expect(refresh).toHaveBeenCalledWith({ status: expectedStatus });
    };

    it("calls the API to enable when the enable button is clicked", async () => {
      await testCall("disabled", 0, ["enable", undefined], "enabled");
    });

    it("calls the API to disable when the disable permanently button is clicked", async () => {
      await testCall("enabled", 0, ["disable", undefined], "disabled");
    });

    it("calls the API to disable when the 10 second button is clicked", async () => {
      await testCall("enabled", 1, ["disable", 10], "disabled");
    });

    it("calls the API to disable when the 30 second button is clicked", async () => {
      await testCall("enabled", 2, ["disable", 30], "disabled");
    });

    it("calls the API to disable when the 5 minute button is clicked", async () => {
      await testCall("enabled", 3, ["disable", 5 * 60], "disabled");
    });

    it("waits for the first call to finish before sending another", () => {
      const setStatus = jest.fn(() =>
        Promise.resolve({ status: "success" } as ApiSuccessResponse)
      );

      const wrapper = renderEnableDisable({
        status: "disabled",
        onSetStatus: setStatus
      });

      wrapper.setState({ processing: true });

      wrapper
        .find(NavButton)
        .props()
        .onClick({} as MouseEvent);

      expect(setStatus).not.toHaveBeenCalled();
    });

    it("cancels an in-flight request when unmounting", async () => {
      const setStatus = jest.fn(() =>
        Promise.resolve({ status: "success" } as ApiSuccessResponse)
      );
      const refresh = jest.fn();

      const wrapper = renderEnableDisable({
        refresh,
        status: "disabled",
        onSetStatus: setStatus
      });

      wrapper
        .find(NavButton)
        .props()
        .onClick({} as MouseEvent);

      wrapper.unmount();

      // Wait for the setStatus promise to resolve
      await tick();

      expect(refresh).not.toHaveBeenCalled();
    });

    it("resets processing flag if a setStatus request fails", async () => {
      const setStatus = jest.fn(() => Promise.reject({ error: "test" }));

      const wrapper = renderEnableDisable({
        status: "disabled",
        onSetStatus: setStatus
      });

      wrapper
        .find(NavButton)
        .props()
        .onClick({} as MouseEvent);

      expect(wrapper.state().processing).toBeTruthy();

      // Wait for the setStatus promise to resolve
      await tick();

      expect(wrapper.state().processing).toBeFalsy();
    });

    it("calls the API with the custom time specified via modal, and closes the modal", () => {
      const setStatus = jest.fn(() =>
        Promise.resolve({ status: "success" } as ApiSuccessResponse)
      );
      const event = ({ preventDefault: jest.fn() } as any) as FormEvent<
        HTMLFormElement
      >;

      const wrapper = renderEnableDisable({
        status: "enabled",
        onSetStatus: setStatus
      });

      wrapper.setState({ customModalShown: true });
      wrapper.find(Form).props().onSubmit!(event);
      expect(wrapper.find(Modal).props().isOpen).toBeFalsy();
      expect(setStatus).toHaveBeenCalledWith("disable", 60 * 60);
    });
  });

  describe("interactions", () => {
    it("opens the custom time modal with the corresponding button is clicked", () => {
      const wrapper = renderEnableDisable({ status: "enabled" });

      expect(wrapper.find(Modal).props().isOpen).toBeFalsy();

      wrapper
        .find(NavButton)
        .last()
        .props()
        .onClick({} as MouseEvent);

      expect(wrapper.find(Modal).props().isOpen).toBeTruthy();
    });

    it("should close the modal when clicking outside", () => {
      const wrapper = renderEnableDisable({ status: "enabled" });

      wrapper.setState({ customModalShown: true });
      expect(wrapper.find(Modal).props().isOpen).toBeTruthy();
      wrapper.find(Modal).props().toggle!();
      expect(wrapper.find(Modal).props().isOpen).toBeFalsy();
    });

    it("should close the modal when the header close button is clicked", () => {
      const wrapper = renderEnableDisable({ status: "enabled" });

      wrapper.setState({ customModalShown: true });
      expect(wrapper.find(Modal).props().isOpen).toBeTruthy();
      wrapper.find(ModalHeader).props().toggle!();
      expect(wrapper.find(Modal).props().isOpen).toBeFalsy();
    });

    it("should close the modal when the cancel button is clicked", () => {
      const wrapper = renderEnableDisable({
        status: "enabled"
      });

      wrapper.setState({ customModalShown: true });
      expect(wrapper.find(Modal).props().isOpen).toBeTruthy();
      wrapper
        .find(ModalFooter)
        .childAt(1)
        .props()
        .onClick();
      expect(wrapper.find(Modal).props().isOpen).toBeFalsy();
    });

    it("should allow custom disable times", () => {
      const wrapper = renderEnableDisable({ status: "enabled" });

      wrapper.setState({ customModalShown: true });

      // Check the default
      let timeInput = wrapper.find(Input).first();
      expect(timeInput).toHaveValue(60);

      const event = {
        target: { value: "42" }
      } as ChangeEvent<HTMLInputElement>;
      timeInput.props().onChange!(event);
      timeInput = wrapper.find(Input).first();
      expect(timeInput).toHaveValue(42);
    });

    it("should allow changing the custom disable time unit", () => {
      const wrapper = renderEnableDisable({ status: "enabled" });

      wrapper.setState({ customModalShown: true });

      // Check the default
      let timeUnit = wrapper.find(Input).last();
      expect(timeUnit).toHaveValue(60);

      const event = {
        target: { value: "1" }
      } as ChangeEvent<HTMLInputElement>;
      timeUnit.props().onChange!(event);
      timeUnit = wrapper.find(Input).last();
      expect(timeUnit).toHaveValue(1);
    });
  });

  describe("rendering", () => {
    it("renders null if status is unknown", () => {
      const wrapper = renderEnableDisable({ status: "unknown" });

      expect(wrapper).toBeEmptyRender();
    });

    it("shows an enable button if status is disabled", () => {
      const wrapper = renderEnableDisable({ status: "disabled" });

      expect(wrapper.find(NavButton).props().name).toEqual("Enable");
    });

    it("shows a dropdown with disable buttons if status is enabled", () => {
      const wrapper = renderEnableDisable({ status: "enabled" });

      expect(wrapper.find(NavDropdown)).toExist();
      expect(wrapper.find(NavButton)).toHaveLength(5);
    });
  });
});
