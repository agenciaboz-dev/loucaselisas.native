import { Status } from "../types/server/class/Course"

export const formatStatus = (status: Status) => {
    const formats = {
        active: "Ativo",
        pending: "Pendente",
        disabled: "Inativo",
        declined: "Recusado",
    }

    return formats[status]
}
