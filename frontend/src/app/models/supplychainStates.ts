export type AnimalDeliverStatus = {
    farmer: boolean;
    butcher: boolean;
};

export type AnimalProcessStatus = {
    butcher: boolean;
};

export type BoxesProcessStatus = {
    butcher: boolean;
};

export type BoxesDistributionStatus = {
    butcher: boolean;
    delivery: boolean;
};

export type BoxesDeliverStatus = {
    delivery: boolean;
};
