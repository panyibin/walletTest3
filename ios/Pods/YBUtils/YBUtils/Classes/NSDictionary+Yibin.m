//
//  NSDictionary+Yibin.m
//  Pods-YBUtils_Example
//
//  Created by PanYibin on 2018/3/11.
//

#import "NSDictionary+Yibin.h"

@implementation NSDictionary (Yibin)

- (BOOL)getBoolForKey:(NSString*)key {
    id ob = [self objectForKey:key];
    if(ob && [ob respondsToSelector:@selector(boolValue)]) {
        return [ob boolValue];
    } else {
        return NO;
    }
}

- (NSInteger)getIntegerForKey:(NSString*)key {
    id ob = [self objectForKey:key];
    if(ob && [ob respondsToSelector:@selector(integerValue)]) {
        return [ob integerValue];
    } else {
        return 0;
    }
}

- (float)getFloatForKey:(NSString*)key {
    id ob = [self objectForKey:key];
    if(ob && [ob respondsToSelector:@selector(floatValue)]) {
        return [ob floatValue];
    } else {
        return 0;
    }
}

- (NSString*)getStringForKey:(NSString*)key {
    id ob = [self objectForKey:key];
    if(ob && [ob isKindOfClass:[NSString class]]) {
        return ob;
    } else {
        return nil;
    }
}

- (NSArray*)getArrayForKey:(NSString*)key {
    id ob = [self objectForKey:key];
    if(ob && [ob isKindOfClass:[NSArray class]]) {
        return ob;
    } else {
        return nil;
    }
}

- (NSDictionary*)getDictionaryForKey:(NSString*)key {
    id ob = [self objectForKey:key];
    if(ob && [ob isKindOfClass:[NSDictionary class]]) {
        return ob;
    } else {
        return nil;
    }
}

@end
