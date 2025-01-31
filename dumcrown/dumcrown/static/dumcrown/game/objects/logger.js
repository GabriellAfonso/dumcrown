class Logger {
    constructor() {
        this.isEnabled = true; // Controle global para o logger
        this.isEnabledDetail = true;
        this.enabledGroups = new Set(); // Grupos de log habilitados

    }

    enableGroup(group) {
        this.enabledGroups.add(group);
    }

    disableGroup(group) {
        this.enabledGroups.delete(group);
    }

    log(group, ...args) {
        if (this.isEnabled && (this.enabledGroups.has(group) || this.enabledGroups.has('all'))) {
            console.log(`[${group.toUpperCase()} LOG]:`, ...args);
        }
    }

    info(group, ...args) {
        if (this.isEnabled && (this.enabledGroups.has(group) || this.enabledGroups.has('all'))) {
            console.info(`[${group.toUpperCase()} INFO]:`, ...args);
        }
    }

    warn(group, ...args) {
        if (this.isEnabled && (this.enabledGroups.has(group) || this.enabledGroups.has('all'))) {
            console.warn(`[${group.toUpperCase()} WARN]:`, ...args);
        }
    }

    error(group, ...args) {
        if (this.isEnabled && (this.enabledGroups.has(group) || this.enabledGroups.has('all'))) {
            console.error(`[${group.toUpperCase()} ERROR]:`, ...args);
        }
    }

    detail(group, ...args) {
        if (this.isEnabledDetail && (this.enabledGroups.has(group) || this.enabledGroups.has('all'))) {
            console.log(`[${group.toUpperCase()} DETAIL]:`, ...args);
        }
    }

    group(label) {
        if (this.isEnabled) {
            console.group(label);
        }
    }

    groupEnd() {
        if (this.isEnabled) {
            console.groupEnd();
        }
    }
}

export default Logger;
