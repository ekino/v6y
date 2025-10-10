import * as React from 'react';

const VitalityDashboardMenu = ({ options }: { options: Array<{ title: string; url: string }> }) => {
    return (
        <div data-testid="mock-dashboard-menu">
            {options.map((opt) => (
                <div key={opt.title} data-testid="mock-menu-item">
                    {opt.title}
                </div>
            ))}
        </div>
    );
};

export default VitalityDashboardMenu;
