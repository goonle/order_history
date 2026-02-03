"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { listVendorsAction } from "@/server/actions/vendor.action";
import { listTemplatesByVendorAction } from "@/server/actions/template.action";

import TemplatesScreen from "@/app/components/settings/templates/TemplateScreen";
import { Vendor } from "@/app/model/vendor";
import { Template } from "@/app/model/template";

export default function TemplatesPage() {
    const router = useRouter();
    const sp = useSearchParams();

    const vendorIdFromUrl = useMemo(() => {
        const raw = sp.get("vendorId");
        const n = raw ? Number(raw) : 0;
        return Number.isFinite(n) ? n : 0;
    }, [sp]);

    const [vendorList, setVendorList] = useState<Vendor[]>([]);
    const [vendorListLoading, setVendorListLoading] = useState(false);

    const [templateList, setTemplateList] = useState<Template[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);

    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [selectedVendorId, setSelectedVendorId] = useState<number>(vendorIdFromUrl);

    const fetchVendorList = useCallback(async () => {
        setVendorListLoading(true);
        try {
            const res = await listVendorsAction();
            setVendorList(res.ok ? res.data.vendorList || [] : []);
        } finally {
            setVendorListLoading(false);
        }
    }, []);

    const fetchTemplates = useCallback(async (vendorId: number) => {
        setTemplatesLoading(true);
        try {
            const res = await listTemplatesByVendorAction(vendorId);
            setTemplateList(res.ok ? res.data.templates || [] : []);
        } finally {
            setTemplatesLoading(false);
        }
    }, []);

    // 1) vendor list 로드
    useEffect(() => {
        fetchVendorList();
    }, [fetchVendorList]);

    // 2) vendorList가 생기면 vendorId 확정 (url 없으면 첫 vendor로 강제)
    useEffect(() => {
        if (vendorList.length === 0) return;

        const urlId = vendorIdFromUrl;
        const validId = urlId && vendorList.some((v) => v.id === urlId) ? urlId : vendorList[0].id;

        // url에 vendorId가 없거나 invalid면 url도 교정
        if (validId !== urlId) {
            router.replace(`/settings/templates?vendorId=${validId}`);
        }

        setSelectedVendorId(validId);
        setSelectedVendor(vendorList.find((v) => v.id === validId) || null);
    }, [vendorList, vendorIdFromUrl, router]);

    // 3) selectedVendorId 바뀌면 templates 로드
    useEffect(() => {
        if (!selectedVendorId) return;
        fetchTemplates(selectedVendorId);
    }, [selectedVendorId, fetchTemplates]);

    return (
        <TemplatesScreen
            vendorList={vendorList}
            vendorListLoading={vendorListLoading}
            templatesLoading={templatesLoading}
            vendorId={selectedVendorId}
            vendor={selectedVendor}
            templateList={templateList}
        />
    );
}
