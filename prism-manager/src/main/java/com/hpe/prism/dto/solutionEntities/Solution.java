package com.hpe.prism.dto.solutionEntities;

import lombok.Data;
import lombok.NonNull;

@Data
public class Solution {
    
    @NonNull
    String solutionName;
    
    @NonNull
    String solutionId;
    
    @NonNull
    Instance[] instances;
}
