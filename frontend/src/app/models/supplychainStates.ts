export type AnimalDeliverStatus = {
    farmer: boolean;
    butcher: boolean;
};

export type AnimalProcessStatus = {
    butcher: boolean;
};

export type BoxProcessStatus = {
    butcher: boolean;
};

export type BoxDistributionStatus = {
    butcher: boolean;
    delivery: boolean;
};

export type BoxDeliverStatus = {
    delivery: boolean;
};

export type ProcessedBoxesCounter = {
  butcher: number;
}

export type DistributedBoxesCounter = {
  butcher: number;
  delivery: number;
}

export type DeliveredBoxesCounter = {
  delivery: number;
}
