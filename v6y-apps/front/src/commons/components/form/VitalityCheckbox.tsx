import { Checkbox } from 'antd';
import { Control, Controller } from 'react-hook-form';

type VitalityCheckboxProps = {
    name: string;
    control: Control;
    ariaLabel: string;
};

const VitalityCheckbox = ({ name, control, ariaLabel }: VitalityCheckboxProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, ...field } }) => (
                <Checkbox {...field} checked={value}>
                    {ariaLabel}
                </Checkbox>
            )}
        />
    );
};

export default VitalityCheckbox;
