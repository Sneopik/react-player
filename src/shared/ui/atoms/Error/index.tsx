import { ComponentProps } from 'react';

type Props = {
  msg: string;
} & ComponentProps<'div'>;

export const Error = ({ msg, ...props }: Props) => {
  if (!msg) {
    return null;
  }

  return (
    <div {...props}>
      <span>{msg}</span>
    </div>
  );
};
