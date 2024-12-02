import { Injectable } from '@nestjs/common';

@Injectable()
export class CycleService {

    async getCycles(workspaceSlug: string, projectId: string, cycleType?: string) {
        // Get cycles
    }

    async createCycle(workspaceSlug: string, projectId: string, cycleData: any) {
        
    }

    async updateCycle(workspaceSlug: string, projectId: string, cycleId: string, updateData: any) {
        // Update cycle
    }

    async deleteCycle(workspaceSlug: string, projectId: string, cycleId: string) {
        // Delete cycle
    }

    async cycleDateCheck(workspaceSlug: string, projectId: string, dateCheckData: any) {
        // Check cycle date
    }
    
}
