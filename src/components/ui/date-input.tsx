import { TextInput, type TextInputProps } from '@/components/ui/text-input';
import { maskBrDate } from '@/utils/date';

type DateInputProps = Omit<TextInputProps, 'value' | 'onChangeText' | 'keyboardType'> & {
  value: string;
  onChangeText: (value: string) => void;
};

export function DateInput({ onChangeText, ...rest }: DateInputProps) {
  return (
    <TextInput
      placeholder="DD/MM/AAAA"
      keyboardType="number-pad"
      maxLength={10}
      onChangeText={(text) => onChangeText(maskBrDate(text))}
      {...rest}
    />
  );
}
