import { Story } from "@storybook/react";
import DeleteModal, {
  IDeleteModalProps,
} from "../app/components/UI/DeleteModal";

export default {
  title: "Delete Modal",
  component: DeleteModal,
};

const Template: Story<IDeleteModalProps> = (args) => <DeleteModal {...args} />;

export const Default = Template.bind({});

Default.args = {
  type: "Employee",
  name: "Test Employee ",
  //confirmMethod: () => void;
  //closeModal: () => void;
};
